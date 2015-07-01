'use strict';


angular.module('core').controller('HomeController', ['Socket','$scope', '$http', 'Authentication',
	function(Socket, $scope, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		//-----------------------------------------Scope Vars----------------------------------------------------
		$scope.authentication = Authentication;
		$scope.vars = [];
		$scope.time = '';
		$scope.checkTime = function(i){
			if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		};

		$scope.stati = [
			0,
			1,
			2,
			0,
			1,
			2
		];
		$scope.nivars = [
			{	name: '',value: '0,0'	},
			{	name: '',value: '1,0'	},
			{	name: '',value: '2,0'	},
			{	name: '',value: '3,0'	},
			{	name: '',value: '4,0'	}
		];
		$scope.cuvars = [
			{	name: '',value: '00,0'	},
			{	name: '',value: '11,0'	},
			{	name: '',value: '22,0'	},
			{	name: '',value: '33,0'	},
			{	name: '',value: '44,0'	}
		];
		$scope.mevars = [
			{	name: '',value: '000,0'	},
			{	name: '',value: '111,0'	},
			{	name: '',value: '222,0'	},
			{	name: '',value: '333,0'	},
			{	name: '',value: '444,0'	}
		];
		$scope.si1vars = [
			{	name: '',value: '0000,0'	}
		];
		$scope.si2vars = [
			{	name: '',value: '00000,0'	}
		];
		$scope.spvars = [
			{	name: '',value: '000000,0'	}
		];
		$scope.rowNames = [
			'Nickel',
			'Kupfer',
			'Messing',
			'Schere 1',
			'Schere 2',
			'Spuler'
		];
		$scope.colNames = [
			'',
			'Geschw.',
			'Breite',
			'Dicke',
			'Coil #',
			'Wechsel'
		];

//-----------------------------------------Controller Functions------------------------------------------
		$http.get('/statuses').success(function(data) {
			if (data.length >0){
				for (var i=0; i<data.length;i++){
					var Var = {
						name: 'Wert'+(i+1),
						value: data[i]
					};
					$scope.vars.push(Var);
				}
			}
		});
		$scope.getVars = function(data){
			//console.log("got new Data:" +data);
			if (data.length >0){
				for (var i=0; i<data.length;i++){
					if(i<3){
						$scope.nivars[i].value = $scope.scrapeValue(data[i]);
					}
					if(i===3){
						$scope.nivars[i].value = data[i]+' '+data[i+1]+' '+data[i+2];
					}
					if(i===6){
						$scope.nivars[i-2].value = $scope.checkTime(data[i])+ ' : '+ $scope.checkTime(data[i+1]);
					}
					if(i>7 && i<11){
						$scope.cuvars[i-8].value = $scope.scrapeValue(data[i]);
					}
					if(i===11){
						$scope.cuvars[i-8].value = data[i]+' '+data[i+1]+' '+data[i+2];
					}
					if(i===14){
						$scope.cuvars[i-10].value =  $scope.checkTime(data[i])+' : '+ $scope.checkTime(data[i+1]);
					}
					if(i>15 && i<19){
						$scope.mevars[i-16].value = $scope.scrapeValue(data[i]);
					}
					if(i===19){
						$scope.mevars[i-16].value = data[i]+' '+data[i+1]+' '+data[i+2];
					}
					if(i===22){
						$scope.mevars[i-18].value =  $scope.checkTime(data[i])+' : '+ $scope.checkTime(data[i+1]);
					}
					if(i>23 && i<25){
						$scope.si1vars[i-24].value = $scope.scrapeValue(data[i]);
					}
					if(i>24 && i<26){
						$scope.si2vars[i-25].value = $scope.scrapeValue(data[i]);
					}
					if(i>25 && i<27){
						$scope.spvars[i-26].value = $scope.scrapeValue(data[i]);
					}
				}

			}
			setTimeout(function(){
				Socket.emit('getVars',null);
			},1000);
		};
//-----------------------------------------Socket Emitter------------------------------------------
		// Ask Server to get new Vars
		Socket.emit('getVars',null);

//-----------------------------------------Socket Events------------------------------------------
		// Event called when server passes new Variables
		Socket.on('getVars_ret', $scope.getVars);

//-----------------------------------------Color Styles-------------------------------------------
		$scope.returnRedGreenStyle = function(status) {
			if(status===0)
				return 'background-color: green;';
			if(status===1)
				return 'background-color: rgb(0, 75, 255);';
			if(status===2)
				return 'background-color: red;';

			// ADD THIS TO THE VIEW STYLE ATTRIBUTE {{returnRedGreenStyle(stati[0])}}
		};
		$scope.scrapeValue = function(value){
			if(value != '0') {
				var pos = value.indexOf(",");
				var pre = value.slice(0, pos);
				var post = value.slice(pos, value.length);
				post = post.slice(0, 2);
				return pre + post;
			}else{
				return value;
			}

		}

	}
]);
