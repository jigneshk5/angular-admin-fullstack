(function(){
'use strict';

class TasksController {
  constructor($scope, $http, $timeout, $uibModal, $window, $q, $state, Modal, appConfig) {
    this.$window = $window;
    this.$window.scrollTo(0, 0);
		this.$scope = $scope;
		this.$http = $http;
    this.appConfig = appConfig;
		this.$timeout = $timeout;
		this.$uibModal = $uibModal;
    this.$state = $state;
		this.$q = $q;
		this.Modal = Modal;
    this.periodNames = ['Morning', 'Afternoon', 'Evening'];
    this.today = new Date(new Date().setHours(0, 0, 0, 0));
    this.costcos = this.appConfig.costcos;
    this.alphabet = this.appConfig.alphabet;
    // date picker settings
    this.pickStart = new Date(new Date().setHours(0, 0, 0, 0));
    this.pickEnd = new Date(new Date().setHours(7 * 23 + 6, 59, 59, 59));
    this.isStartTimeDatepickerOpen = false;
    this.isEndTimeDatepickerOpen = false;
    // agents and store
    this.agents = [];
    this.selectedAgent = {};
    this.selectedStore = {};
    // times
		this.timeWindows = [];
    this.selectedTime = {}; // time window
    this.selectedTimeOrders = []; // time orders field
    this.selectedOrders = []; // orders selected for dispatch
		this.loadTimeWindows();
    this.getAgents();
	}

  getAgents() {
    this.$http.get('/api/agents')
    .then((res) => {
      this.agents = res.data.data;
    });
  }

  createTasks() {
    let data = {
      orders: this.selectedOrders,
      start_time: this.selectedTime.start_time,
      end_time: this.selectedTime.end_time,
      store: this.selectedStore,
      agent: this.selectedAgent
    };
    this.Modal.confirm.action(() => {
      this.$http.post('/api/tasks/', data)
        .then(res => {
          window.alert('Created '+res.data.length+' tasks.');
          let type = 'Delivery';
          let message = 'success.';
          res.data.forEach(task => {
            if (task.has_pickup) {
              type = 'Pickup';
            }
            if (task.status !== 200) {
              message = 'failed.';
            }
            window.alert(type+' for order ID: '+task.order_id+' '+message+'\n'+task.message+'\nJob ID: '+task.job_id+'\nTracking Link: '+task.tracking_link);
          });
        }, (err) => {
          window.alert(err);
        });
    })();
  }

	loadTimeWindows() {
    this.$http.get('/api/time_windows', {
      params: {
        start_time: this.pickStart.toISOString(),
        end_time: this.pickEnd.toISOString()
      }
    }).then((res) => {
      let schedData = []; // initialize time array
      res.data.map(function(date) { // initialize all days from delivery times in array
        date.start_time = new Date(date.start_time);
        date.end_time = new Date(date.end_time);
        var dateStartMidnight = new Date(new Date(date.start_time.getTime()).setHours(0,0,0,0));
        if (schedData[0]) {
          var lastStartMidnight = new Date(new Date(schedData[schedData.length - 1][0].start_time.getTime()).setHours(0,0,0,0));
          if (dateStartMidnight > lastStartMidnight) { // if day larger than midnight of last day we have new day array
            schedData.push([]); // add new empty array for dates
          }
          schedData[schedData.length - 1].push(date); // add date to last day array
        } else {
          schedData.push([]); // add first empty day array for dates
          schedData[0].push(date); // add date to first day array
        }
      });
			this.timeWindows = schedData; // parse times and update
		});
	}

  selectTime(time) {
    this.selectedTime = time;
    this.selectedTimeOrders = [];
    if (time.orders.length > 0) {
      this.$http.get('/api/orders', {
        params: {
          ids: time.orders.toString()
        }
      }).then(res => {
        this.selectedTimeOrders = res.data;
        console.log(this.selectedTimeOrders);
      }).catch(err => {
        window.alert('Error fetching time window orders' + err);
      });
    }
    this.selectedTime = time;
  }

  selectReset() {
    this.selectedTime = {};
    this.selectedTimeOrders = [];
  }

  toggleOrder(orderid) {
    let index = this.selectedOrders.indexOf(orderid);
    if (index > -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(orderid);
    }
  }

  totalPrice() {
    let order_total = this.selectedTimeOrders.reduce((total, order) => {
      return total + parseFloat(order.total_price);
    }, 0);
    return order_total.toFixed(2);
  }

  totalOrders(day) {
    let total = 0;
    day.forEach(time => {
      total += time.orders.length;
    });
    return total;
  }

  getGoogleMapsURL() {
    if (this.selectedAgent.hasOwnProperty('latitude')) {
      return 'https://maps.google.com?q=' +
        this.selectedAgent.latitude + ',' +
        this.selectedAgent.longitude;
    }
  }
}

angular.module('blurAdminFullstackApp.pages.tasks')
  .controller('TasksController', TasksController);

})();
