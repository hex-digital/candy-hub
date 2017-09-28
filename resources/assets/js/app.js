
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
require('babel-core/register');
require('lity');
require('babel-polyfill');

require('./classes/Errors');
require('./classes/Form');

//window.Datepicker = require('bootstrap-datepicker');
require('bootstrap-datepicker');
require('bootstrap-select');
require('bootstrap-switch');
require('bootstrap-tagsinput');
require('dropzone');
require('selectize');

window.List = require('list.js');


require('./components');

/**
 * Directives
 */

import Sortable from 'sortablejs';

Vue.directive('sortable', {
  inserted: function (el, binding) {
    var sortable = new Sortable(el, binding.value || {});
  }
});

window.CandyEvent = new Vue();

var ApiRequest = require('./classes/ApiRequest');
window.apiRequest = new ApiRequest();

var Dispatcher = require('./classes/Dispatcher');
window.Dispatcher = new Dispatcher();

var Locale = require('./classes/Locale');
window.locale = new Locale();

var Config = require('./classes/Config');
window.config = new Config();


var CandyHelpers = {};

CandyHelpers.install = function (Vue, options) {
  Vue.capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};

window.moment = require('moment');

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});

Vue.filter('t', function (value, lang) {
    if (!lang) {
        lang = locale.current();
    }
    if (!value[lang]) {
        return value[Object.keys(value)[0]];
    }
    return value[lang];
});

var channels = [];
config.get('channels').then(response => {
  channels = response.data;
});

var languages = [];
config.get('languages').then(response => {
  languages = response.data;
});

/**
 * Digs out an attribute for an object
 * @param  {[type]} 'attribute'
 * @param  {Object}
 * @return {string}
 */
Vue.filter('attribute', (obj, attr, lang, name) => {

  var handle,
      lang = lang ? lang : locale.current();

  var defaultLocale = languages.find(lang => {
    if (lang.default) {
      return true;
    }
  });

  channels.forEach(channel => {
    if (name && channel.handle == name) {
      handle = channel.handle;
    } else if (channel.default) {
      handle = channel.handle;
    }
  });

  var ref = attr + '.' + handle + '.' + lang,
      str = _.get(obj.attribute_data, ref);

  if (!str) {
    ref = ref.replace(lang, defaultLocale.lang);
  }

  str = _.get(obj.attribute_data, ref);
  return (str ? str : 'Unable to find attribute');
});


const app = new Vue({
    el: '#app',
    data: {
    },
});

Vue.use(CandyHelpers);


window.axios.interceptors.response.use((response) => { // intercept the global error
    return response
  }, function (error) {
    if (error.response.status === 401) {
        window.location.href = '/login';
        return;
    }
    // Do something with response error
    return Promise.reject(error)
  });





/* Misc crap - need to remove!!! */

// Clickable Table Row
$(".clickable .link").click(function() {
    window.location = $(this).data("href");
});

// Adding /Removing table row for product options

// Navigation Purple Overlay
$('.top-level').hover (
   function(){ $('.main-purple-overlay').addClass('active'); $('.side-purple-overlay').addClass('active'); },
   function(){ $('.main-purple-overlay').removeClass('active'); $('.side-purple-overlay').removeClass('active'); }
);

// Filter Pop Over
$('.btn-pop-over').click(function() {
    $('.pop-over').toggleClass('active');
});

// Product Menu
$('.product-menu').click(function() {
    $(this).toggleClass('active');
});
$('.bulk-actions').css({
    'width': ($('.product-table').width() + 'px')
});

// Tabs
var hash = document.location.hash;
var prefix = "tab_";
if (hash) {
    $('.nav-tabs a[href="'+hash.replace(prefix,"")+'"]').tab('show');
}

$('.nav-tabs a').on('shown', function (e) {
    window.location.hash = e.target.hash.replace("#", "#" + prefix);
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var target = $(e.target).attr("href");
  $('.bulk-actions').css({
    'width': ($('.product-table').width() + 'px')
  });
  // Variant image height same as width
  var variantImage = $('.variant-option-img').width();
  $('.variant-option-img').css({'height':variantImage+'px'});

  // Media dropzone height same as width
  var dropzone = $('.dropzone').width();
  $('.dropzone').css({'height':dropzone+'px'});
});

// Tooltips
$("[data-toggle='tooltip']").tooltip();

// Tooltips
$('[data-toggle="popover"]').popover();

// Date Picker

// Switch
$(".toggle input").bootstrapSwitch();

// Category, Collection, Product List Search.

var options = {
  valueNames: [ 'name' ]
};

var optionsTwo = {
  valueNames: [ 'name', 'sku', 'category', 'collection' ]
};

var categoryList = new List('categoryList', options);
var collectionList = new List('collectionList', options);
var productList = new List('productList', optionsTwo);

// Category, Collection Associations, hightlight

$('.association-table input:checkbox').change(function(){
    if($(this).is(":checked")) {
        $(this).parents('tr').addClass("selected");
    } else {
        $(this).parents('tr').removeClass("selected");
    }
});