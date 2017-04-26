'use strict';
(function(){

class OrdersController {
  constructor($scope, $http, $uibModal, $state, Modal, appConfig) {
    this.appConfig = appConfig;
    this.$scope = $scope;
    this.$state = $state;
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.Modal = Modal;

    //datepicker settings
    this.startPick = new Date(new Date().setHours(-6 * 24, 0, 0, 0));
    this.endPick = new Date(new Date().setHours(23, 59, 59, 59));
    this.isStartTimeDatepickerOpen = false;
    this.isEndTimeDatepickerOpen = false;
    this.generatedDays = [];

    this.selectedStore = null;
    this.orders = [];
    this.form = {};
    this.getOrders();
  }

	getOrders() {
		this.$http.get('/api/orders', {
      params: {
        created_at_min: this.startPick,
        created_at_max: this.endPick
      }
    })
		.then(res => {
			this.orders = res.data;
      console.log(this.orders);
		}, err => {
			window.alert('Couldn\'t fetch orders', err);
		});
	}

  unscheduleOrder() {
    this.Modal.confirm.action(() => {
      this.$http.post('/api/orders/unschedule/'+this.selectedOrder.id+'/'+this.selectedOrder.email)
      .then(res => {
        this.getOrders();
      }, err => {
        window.alert('Couldn\'t unschedule order', err);
      });
    })();
  }

  unassignOrder() {
    this.Modal.confirm.action(() => {
      this.$http.post('/api/orders/unassign/'+this.selectedOrder.id+'/'+this.selectedOrder.email)
      .then(res => {
        this.getOrders();
      }, err => {
        window.alert('Couldn\'t unassign order', err);
      });
    })();
  }

  deleteOrder() {
    this.Modal.confirm.action(() => {
      this.$http.delete('/api/orders/'+this.selectedOrder.id)
      .then(res => {
        this.getOrders();
      }, err => {
        window.alert('Couldn\'t delete order', err);
      });
    })();
  }

  pullOrders() {
    this.Modal.confirm.action(() => {
      this.$http.get('/api/orders/pull')
      .then(() => {
        this.$state.reload();
      })
      .catch(() => {
        this.$state.reload();
      });
    })();
  }

	getGoogleMapsURL() {
    if (this.selectedOrder.shipping_address.hasOwnProperty('latitude')) {
      return 'https://maps.google.com?q=' +
        this.selectedOrder.shipping_address.latitude + ',' +
        this.selectedOrder.shipping_address.longitude;
    }
	}

  generateDays() {
    this.generatedDays = [];
    let numDays = Math.ceil((this.pickEnd - this.pickStart)/1000/60/60/24);
    let start = new Date(this.pickStart.getTime());
    this.generatedDays.push(new Date(start.getTime()));
    for (let i = 0; i < numDays-1; i++) {
      this.generatedDays.push(new Date(start.setHours(24, 0, 0, 0)));
    }
  }
}

angular.module('blurAdminFullstackApp.pages.orders')
  .controller('OrdersController', OrdersController);

})();
