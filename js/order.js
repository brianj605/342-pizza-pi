"use strict";


$(document).ready(function($){
	

	$("#crust-choice").on("change", function(e){
	
		validateSize();
	
		$("#pizza-size-container").removeClass("hidden");
	});


	$("#pizza-size").on("change", function(e){
		$(".toppings-container").removeClass("hidden");
	});


	$(".pizza-updater").on("change", function(e){
	
		displayTotalPrice();

		saveOrder();
	});
	
	$('#clear-order').on('click', function(e) {
	
		let order = createOrder();
		localStorage.pizza_order = JSON.stringify(order);
		restoreOrder(order);
		displayTotalPrice();
	});

    
	// Display prices based on data-price
	$('label.display-price input, option.display-price').each(function(i,v) {

		let _v = $(v);
		let itemPrice = _v.closest('[data-price]').data('price');

		if (itemPrice == 0) {
			itemPrice = 'no surcharge'
		} else {
			itemPrice = '$' + itemPrice;
		}

		_v.closest('.display-price').append(' (' + itemPrice + ')');
	})
	
	let pizzaOrder = getOrder();
	restoreOrder(pizzaOrder);

	displayTotalPrice();
});


function validateSize() {

	if ($("#crust-choice").val() == 'deep') {
		
		if ($("#pizza-size").val() == 'sm') {
			$("#pizza-size").val('md'); // Change selected value to medium
			$('#size-alert-holder').html($('#size-alert').html()); // Show dismissable alert to user
			
			displayTotalPrice(); // Update the price total
		}

		$('#pizza-size option[value=sm]').prop('disabled', true); // Disable small option

	} else {
		
		$('#pizza-size option[value=sm]').prop('disabled', false); // Enable the small option, if the crust isn't deep
	}
}

function createOrder() {
	return {
		crust: null,
		size: null,
		toppings: {}
	};
}


function saveOrder() {

	let pizzaOrder = {};
	
	pizzaOrder.crust = $('#crust-choice').val();
	pizzaOrder.size = $('#pizza-size').val();
	
	
	pizzaOrder.toppings = {};
	
	$('[name=topping\\[\\]]:checked').each(function(i, v) {
		let toppingValue = $(v).val()
		pizzaOrder.toppings[toppingValue] = true;
		
		console.log('toppings', toppingValue);
	});
	
	

	localStorage.pizza_order = JSON.stringify(pizzaOrder);
	
	console.log('save', pizzaOrder)
}


function restoreOrder(pizzaOrder) {

	$('#crust-choice').val(pizzaOrder.crust);
	$('#pizza-size').val(pizzaOrder.size);
	
	$("#pizza-size-container").toggleClass("hidden", ($('#crust-choice').val() == null || $('#crust-choice').val() == ''));
	$(".toppings-container").toggleClass("hidden", ($('#pizza-size').val() == null || $('#pizza-size').val() == ''));
	
	$('[name=topping\\[\\]]').each(function(i, v) {
	
		let _v = $(v);
	
		let toppingName = _v.val();
		_v.prop('checked', pizzaOrder.toppings[toppingName] == true);
	});
	
	//console.log('restore', pizzaOrder)
	
	validateSize();

}


function getOrder() {
	return (localStorage['pizza_order'])
		? JSON.parse(localStorage['pizza_order'])
		: createOrder();
}


function displayTotalPrice() {
	let totalPrice = 0;

	$(':selected, :checked').not('[disabled]').each(function(i,v) {
		let itemPrice = parseFloat($(v).closest('[data-price]').data('price'));
		totalPrice += itemPrice;
		//console.log(i,itemPrice, v);
	});

	$('#total-price').text('$' + totalPrice.toFixed(2));
}






