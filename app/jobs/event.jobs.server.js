
module.exports = function(agenda) {
	var i = 0 ;
	agenda.define('some job', function(job) {
		i++;
		console.log( i+ "Run at" + new Date().getMinutes() + ":" + new Date().getSeconds());
		
	});
	
	agenda.every('10 seconds', 'some job');
	agenda.define('some job2', function(job) {
		i++;
		console.log( i+ "Runs at" + new Date().getMinutes() + ":" + new Date().getSeconds());
		
	});
	agenda.every('5 seconds', 'some job2');
	
}
