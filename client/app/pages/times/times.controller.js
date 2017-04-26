(function(){
'use strict';

class TimesController {
  constructor($scope, $http, $timeout, $uibModal, $window, $q, $state, Modal, editableOptions) {
    this.$window = $window;
    this.$window.scrollTo(0, 0);
		this.$scope = $scope;
		this.$http = $http;
		this.$timeout = $timeout;
		this.$uibModal = $uibModal;
    this.$state = $state;
		this.$q = $q;
		this.Modal = Modal;
    this.editableOptions = editableOptions;
    this.periodNames = ['Morning', 'Afternoon', 'Evening'];
    this.today = new Date(new Date().setHours(0, 0, 0, 0));
    this.pickDate = new Date(new Date().setHours(0, 0, 0, 0));
    // agents
    this.agents = [];
    this.selectedAgent = {};
    // time generation settings
    this.generatedTimes = [];
    this.selectedGeneratedTimes = [];
    this.generateStartTime = 7;
    this.generateEndTime = 21;
    this.generateInterval = 2;
    this.generateExpire = 60;
    this.generateMaxOrders = 10;
    this.generateMaxTotal = 600;
    // time window
		this.timeWindows = [];
    this.selectedTime = {};
    this.selectedTimeOrders = [];
		this.loadTimeWindows();
    this.generateTimeWindows();
	}

	loadTimeWindows() {
    this.timeWindows = [];
    let day_end = new Date(new Date(this.pickDate.getTime()).setHours(23,59,59,59))
    this.$http.get('/api/time_windows', {
      params: {
        start_time: this.pickDate,
        end_time: day_end
      }
    }).then((res) => {
			this.timeWindows = res.data.map(time => { // parse times and update
        time.start_time = new Date(time.start_time);
        time.end_time = new Date(time.end_time);
        time.expire_time = new Date(time.expire_time);
        return time;
      });
		});
	}

	generateTimeWindows() {
    this.generatedTimes = [];
		var year = this.pickDate.getFullYear();
		var month = this.pickDate.getMonth();
		var day = this.pickDate.getDate();
		for (var j = this.generateStartTime; j <= this.generateEndTime; j++) {
      let start_time = new Date(year, month, day, j);
			var time = {
				start_time: start_time,
				end_time: new Date(year, month, day, j + this.generateInterval),
        expire_time: new Date(start_time.getTime() - this.generateExpire*60000),
        max_orders: this.generateMaxOrders,
        max_total: this.generateMaxTotal
			};
      this.generatedTimes.push(time);
    }
	}

  submitTimeWindows() {
    this.Modal.confirm.action(() => {
      let promises = [];
      this.selectedGeneratedTimes.forEach(time => {
        promises.push(this.$http.post('/api/time_windows', time));
      });
      Promise.all(promises)
        .then(res => {
          this.loadTimeWindows();
        }).catch(err => {
          window.alert(err.data);
          this.loadTimeWindows();
        });
    })();
  }

  editTimeWindow() {
    this.$http.patch('/api/time_windows/'+this.selectedTime._id, this.selectedTime)
      .then(res => {
        this.loadTimeWindows();
      }).catch(err => {
        window.alert(err);
        this.loadTimeWindows();
      })
  }

  removeOrder(removeid) {
    this.Modal.confirm.action(() => {
      this.selectedTime.orders.forEach((orderid, index, orders) => {
        if (orderid === removeid) {
          orders.splice(index, 1)
        }
      });
      this.$http.patch('/api/time_windows/'+this.selectedTime._id, this.selectedTime)
        .then(res => {
          this.selectTime(this.selectedTime);
        }).catch(err => {
          window.alert(err);
          this.selectTime(this.selectedTime);
        })
    })();
  }

  deleteTimeWindow() {
    this.Modal.confirm.action(() => {
      this.$http.delete('/api/time_windows/'+this.selectedTime._id)
        .then(res => {
          this.loadTimeWindows();
        }).catch(err => {
          window.alert(err);
          this.loadTimeWindows();
        })
    })();
  }

  selectDate() {
    this.selectedTime = {};
    this.selectedTimeOrders = [];
    this.loadTimeWindows();
    this.generateTimeWindows();
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
      }).catch(err => {
        window.alert('Error fetching time window orders' + err);
      });
    }
  }

  toggleTime(time) {
    var index = this.selectedGeneratedTimes.indexOf(time);
    if (index > -1) {
      this.selectedGeneratedTimes.splice(index, 1);
    } else {
      this.selectedGeneratedTimes.push(time);
    }
  }

  totalPrice() {
    let order_total = this.selectedTimeOrders.reduce((total, order) => {
      return total + parseFloat(order.total_price);
    }, 0);
    return order_total.toFixed(2);
  }

  dayOrders(index) {
    let number = 0;
    this.timeWindows.forEach(window => {
      number += window.orders.length
    });
    return number
  }

  periodFilter(period) {
    return function(time) {
      switch (period) {
        case 0:
          return (time.start_time.getHours() >= 0 && time.start_time.getHours() < 12);
        case 1:
          return (time.start_time.getHours() >= 12 && time.start_time.getHours() < 17);
        case 2:
          return (time.start_time.getHours() >= 17 && time.start_time.getHours() < 23);
      }
    };
  }

  getGoogleMapsURL() {
    if (this.selectedAgent.hasOwnProperty('latitude')) {
      return 'https://maps.google.com?q=' +
        this.selectedAgent.latitude + ',' +
        this.selectedAgent.longitude;
    }
  }
}

angular.module('blurAdminFullstackApp.pages.times')
  .controller('TimesController', TimesController);

})();
