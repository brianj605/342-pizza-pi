"use strict";


$(document).ready(function($){
	
	let pizzaOrder = getOrder();


	$("#crust-choice").on("change", function(e){
		$("#pizza-size-container").removeClass("hidden");
	});

	$("#pizza-size").on("change", function(e){
		$(".toppings-container").removeClass("hidden");
	});

	$(".pizza-updater").on("change", function(e){
		let fieldName = $(this).attr('name');
		pizzaOrder[fieldName] = $(this).val();


		let totalPrice = getTotalPrice();

		console.log('total: ', totalPrice);

		saveOrder(pizzaOrder);
	});

    
	// Display prices based on data-price
	$('label.display-price input, option.display-price').each(function(i,v) {

		let ele = $(v);
		let itemPrice = ele.closest('[data-price]').data('price');

		if (itemPrice == 0) {
			itemPrice = 'no additional charge'
		} else {
			itemPrice = '$' + itemPrice;
		}

		ele.closest('.display-price').append(' (' + itemPrice + ')');
	})
	
	function getTotalPrice() {
		let totalPrice = 0;
	
		$(':selected, :checked').not('[disabled]').each(function(i,v) {
			let itemPrice = parseFloat($(v).closest('[data-price]').data('price'));
			totalPrice += itemPrice;
			console.log(i,itemPrice, v);
		});
		
		return totalPrice;
	}
});

function createOrder() {
    return {
        crust: null,
        size: null,
        toppingsMeat: [],
        toppingsMisc: []
    };
}

function saveOrder(pizzaOrder) {
    localStorage.pizza_order = JSON.stringify(pizzaOrder);
}

function getOrder() {
    return (localStorage['pizza_order'])
        ? JSON.parse(localStorage['pizza_order'])
        : createOrder();
}





