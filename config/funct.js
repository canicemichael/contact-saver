let voucher_codes = require('voucher-code-generator');

let verification_code = () => {
    let ref = voucher_codes.generate({
        length: 22,
        count: 1,
        charset: voucher_codes.charset("alphanumeric")
    });
    return ref[0];
}

var reset_code = ()=>{
	var ref = voucher_codes.generate({
		length: 8,
		count: 1,
		charset: voucher_codes.charset("numbers")
	});
	return ref[0];
}


var get_profit = (user)=>{
	var new_arr = [];
	user.investment.map((inv)=>{
		if(inv.completed === false){
				new_arr.push(inv.interest);
		}
	});
	var interest = new_arr.reduce((a, b)=>{return a+b}, 0);
	return interest;
}

var get_inv = (user)=>{
	var new_arr = [];
	user.investment.map((inv)=>{
		if(inv.completed === false){
				new_arr.push(inv.fund);
		}
	});
	var amount = new_arr.reduce((a, b)=>{return a+b}, 0);
	return amount;
}

var get_bonus = (user)=>{
	var new_arr = [];
	user.bonus.map((b)=>{
		if(b.claimed === false){
				new_arr.push(b.amount);
		}
	});
	var amount = new_arr.reduce((a, b)=>{return a+b}, 0);
	return amount;
}

var ensure_auth = (req, res, next)=> {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error_msg', 'Please Login');
	res.redirect('/login');
};

var forward_auth = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/:id');      
};

var expiration = (minutes) => {
    return new Date(Date.now() + minutes*60000);
}

module.exports = {get_profit, get_inv, get_bonus, verification_code, reset_code, ensure_auth, forward_auth, expiration};