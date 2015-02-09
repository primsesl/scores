	$(function() {
	
//База данных
	var db_name = "events_cal";
	var db_version = "1.0";
    var db_description = "подсчет баллов";
		
	var speckyboy = {}
		speckyboy.init = {}
		speckyboy.init.db = {}
		
	speckyboy.init.open = function(){
		speckyboy.init.db = openDatabase(db_name,db_version,db_description,1024*1024*5);
	}
	speckyboy.init.createTable = function(){
		 var database = speckyboy.init.db;
		 database.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS balls (id INTEGER PRIMARY KEY ASC, desc VARCHAR, ball INT)", []);
			tx.executeSql("CREATE TABLE IF NOT EXISTS work (id INTEGER PRIMARY KEY ASC, date VARCHAR, ls VARCHAR, desc VARCHAR, ball INT)", []);
		 });
	}
	
	// получение данных из БД
	speckyboy.init.addBall = function(desc,ball){
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			 tx.executeSql("INSERT INTO balls (desc, ball) VALUES (?,?)", [desc,ball],
			 speckyboy.init.getBall());
		});
	}
	speckyboy.init.addTehno = function(date, ls, desc, count){
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			tx.executeSql("ALTER TABLE work ADD tehno VARCHAR(35)",[]);
			tx.executeSql("CREATE TABLE IF NOT EXISTS tehno (id INTEGER PRIMARY KEY ASC, desc VARCHAR, num INT)", []);
		});
	}
	
	
	speckyboy.init.getBall = function(){
		var database = speckyboy.init.db;
			$table = $("#scores tbody");
			$table.html('');
			database.transaction(function(tx){
				tx.executeSql("SELECT * FROM balls ORDER BY desc ASC", [], function(tx,result){
					for (var i=0; i < result.rows.length; i++) {
						todo_id = result.rows.item(i).id;
						todo_desc = result.rows.item(i).desc;
						todo_ball = result.rows.item(i).ball;
						$table.append(
							'<tr id="row_ball_'+todo_id+'" data-id="'+todo_id+'">'+
								'<td id="td_ball_desc_'+todo_id+'">'+ todo_desc+'</td>'+
								'<td id="td_ball_ball_'+todo_id+'">'+ todo_ball+'</td>'+
								'<td>'+
								'<button type="button" class="del_ball btn btn-default btn-xs"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'+
								'<button type="button" class="edit btn btn-default btn-xs"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></td>'+
							'</tr>');

					}
				});
			});
		setTimeout(function(){
			deleteClickOn();
			editClickOn();
		}, 200);
	}
	speckyboy.init.editRowBall = function(id){
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			tx.executeSql("SELECT * FROM balls WHERE id=?", [id], function(tx,result){
				for (var i=0; i < result.rows.length; i++) {
					todo_id = result.rows.item(i).id;
					todo_desc = result.rows.item(i).desc;
					todo_ball = result.rows.item(i).ball;
						$('#edit_desc').val(todo_desc);
						$('#edit_ball').val(todo_ball);
						$('#edit_id').html(todo_id);
				}
			});
		});
	}
	speckyboy.init.editSaveBall = function(id, desc, ball){
		//alert(id);
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			tx.executeSql('UPDATE balls SET desc = ?, ball = ? WHERE id = ?', [desc, ball, id]);
		});
	}
	speckyboy.init.deleteRow = function(id, table){
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			tx.executeSql("DELETE FROM "+table+" WHERE id=?",[id]);
		});
	}
//Конец База данных

	$( "#div_edit_ball" ).hide();
	$( "#div_add_ball" ).hide();

	//Технологии
	$( "#div_edit_technology" ).hide();
	$( "#div_add_technology" ).hide();
    $("#technology_add_but").click(function() {
		if($( "#div_edit_technology" ).css('display') == 'block'){
			$( "#div_edit_technology" ).hide('blind', {}, 500, '' );
		}
		if($( "#div_add_technology" ).css('display') == 'block'){
			$( "#div_add_technology" ).hide('blind', {}, 500, '' );
			$("#technology_add_but span").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
		}else{
			$("#technology_add_but span").removeClass("glyphicon-chevron-down");
			$("#technology_add_but span").addClass("glyphicon-chevron-up");
			$( "#div_add_technology" ).show('blind', {}, 500, '' );
		}
    });
	$( "#edit_save_technology" ).click(function() {
		technology_edit_id = $('#edit_id_technology').html();
		technology_edit_desc = $('#technology_edit_desc').val();
		speckyboy.init.editSaveTechnology(technology_edit_id, technology_edit_desc);
		$("#td_ball_desc_"+technology_edit_id).html(technology_edit_desc);
		$("#div_edit_technology").toggle('blind', {}, 500 );
	});
	$("#technology_add").click(function() {
		var val1 = $("#technology_desc").val();
		speckyboy.init.addTechnology(val1);
		$("#technology_desc").val('');
	});


	speckyboy.init.getTechnology = function(){
		var database = speckyboy.init.db;
			$table = $("#technology_scores_table tbody");
			$table.html('');
			database.transaction(function(tx){
				tx.executeSql("SELECT * FROM tehno ORDER BY desc ASC", [], function(tx,result){
					for (var i=0; i < result.rows.length; i++) {
						todo_id = result.rows.item(i).id;
						todo_desc = result.rows.item(i).desc;
						$table.append(
							'<tr id="row_technology_'+todo_id+'" data-id="'+todo_id+'">'+
								'<td id="td_technology_desc_'+todo_id+'">'+ todo_desc+'</td>'+
								'<td>'+
								'<button type="button" class="del_technology btn btn-default btn-xs"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'+
								'<button type="button" class="edit_technology btn btn-default btn-xs"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></td>'+
							'</tr>');

					}
				});
			});
		setTimeout(function(){
			//technologyDeleteClickOn();
			//technologyEditClickOn();
		}, 200);
	}
	speckyboy.init.addTechnology = function(desc){
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			 tx.executeSql("INSERT INTO tehno (desc) VALUES (?)", [desc],
			 speckyboy.init.getTechnology());
		});
	}
	speckyboy.init.editSaveTechnology = function(id, desc){
		//alert(id);
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			tx.executeSql('UPDATE tehno SET desc = ? WHERE id = ?', [desc, id]);
		});
	}
	//Конец Технологии

	//Наряды
	$( "#add_work" ).click(function() {
		speckyboy.init.getBall_for_work();
		speckyboy.init.getTechnology_for_work();
		$('#Modal_add_work').modal('show');
	});
	$( ".add_work_close" ).click(function() {
		$("#div_date").removeClass("has-error");
		$("#div_ls").removeClass("has-error");
		$("#scores_for_add tbody").html('');
		$('#summ').html('');
		$('#Modal_add_work').modal('hide');
	});
	$("#add_ball_for_ls").click(function() {
		$add_sel = $("#add_sel").find(':selected');
		$add_sel_id 	= $add_sel.data('id');
		$add_sel_ball 	= $add_sel.data('ball');
		$add_sel_text 	= $add_sel.text();
		
		$("#scores_for_add tbody").append(
			'<tr data-id="'+$add_sel_id+'">'+
				'<td>'+ $add_sel_text+'</td>'+
				'<td>'+ $add_sel_ball+'</td>'+
			'</tr>');
			
		change_add();
	});
	$( "#add_save_work" ).click(function() {
		var work_desc_arr = [];
		var work_desc_arr_all 	= [],
			count 				= 0;
		var err 				= 0;
		date = $('#work_date').val();
		ls = $('#work_ls').val();
		if(date == ''){
			$("#div_date").addClass("has-error");
			err++;
		}
		if(ls == ''){
			$("#div_ls").addClass("has-error");
			err++;
		}
		if(err != 0){
			return false;
		}
		$add_tehno = $("#add_sel_tehno").find(':selected');
		$add_tehno_id 	= $add_tehno.data('id');
		$add_tehno_text 	= $add_tehno.text();

		$("#scores_for_add tbody tr").each(function () {
			work_desc_arr 		= {};
			work_desc_arr.desc = $(this).find("td:nth-child(1)").text();
			work_desc_arr.ball = $(this).find("td:nth-child(2)").text();
			work_desc_arr_all.push(work_desc_arr);
			count = count + parseFloat($(this).find("td:nth-child(2)").text());
		});
		desc = JSON.stringify(work_desc_arr_all);
		speckyboy.init.addWork(date, ls, desc, count, $add_tehno_text);
		$('#Modal_add_work').modal('hide');
		$('#work_ls').val('');
		$('#work_date').val('');
		$('#summ').html('');
		$("#scores_for_add tbody").html('');
		//speckyboy.init.getWork();
	});

    function change_add() {
		var work_desc_arr_all 	= [],
			work_desc_arr 		= {},
			count 				= 0;
		$("#scores_for_add tbody tr").each(function () {
			work_desc_arr.desc = $(this).find("td:nth-child(1)").text();
			work_desc_arr.ball = $(this).find("td:nth-child(2)").text();
			work_desc_arr_all.push(work_desc_arr);
			count = count + parseFloat($(this).find("td:nth-child(2)").text());
		});
		
		$('#summ').html(count);
		
	
	}
    function deleteClickWorkOn() {
			$( ".del")
				.click(function() {
            var $thisTr = $(this).parent().parent(),
                timeID = $thisTr.data("id");
				$tttt = $("#row_"+timeID);
            speckyboy.init.deleteRow(timeID, 'work') 
			speckyboy.init.getWork();
			$tttt.fadeOut()
        })
    }
	speckyboy.init.getBall_for_work = function(){
		$("#add_sel").html('');
		var database = speckyboy.init.db;
			database.transaction(function(tx){
				tx.executeSql("SELECT * FROM balls ORDER BY desc ASC", [], function(tx,result){
					for (var i=0; i < result.rows.length; i++) {
						todo_id = result.rows.item(i).id;
						todo_desc = result.rows.item(i).desc;
						todo_ball = result.rows.item(i).ball;
						$("#add_sel").append(
								'<option data-id="'+todo_id+'" data-ball="'+todo_ball+'">'+ todo_desc+'</option>');

					}
				});
			});
	}
	speckyboy.init.getTechnology_for_work = function(){
		$("#add_sel_tehno").html('');
		var database = speckyboy.init.db;
			database.transaction(function(tx){
				tx.executeSql("SELECT * FROM tehno ORDER BY desc ASC", [], function(tx,result){
					for (var i=0; i < result.rows.length; i++) {
						todo_id = result.rows.item(i).id;
						todo_desc = result.rows.item(i).desc;
						$("#add_sel_tehno").append(
								'<option data-id="'+todo_id+'">'+ todo_desc+'</option>');

					}
				});
			});
	}
	speckyboy.init.addWork = function(date, ls, desc, count, tehno){
		var database = speckyboy.init.db;
		database.transaction(function(tx){
			 tx.executeSql("INSERT INTO work (date, ls, desc, ball, tehno) VALUES (?,?,?,?,?)", [date, ls, desc, count, tehno],
			 speckyboy.init.getWork());
		});
	}
	speckyboy.init.getWork = function(){
		var database = speckyboy.init.db;
			$table1 = $("#work tbody");
			$table1.html('');
			database.transaction(function(tx){
				tx.executeSql("SELECT * FROM work ORDER BY date ASC", [], function(tx,result){
					total_work = 0;
					for (var il=0; il < result.rows.length; il++) {
						todo_id = result.rows.item(il).id;
						todo_date = result.rows.item(il).date;
						todo_ls = result.rows.item(il).ls;
						//todo_desc = result.rows.item(il).desc;
						todo_desc = show_desc(result.rows.item(il).desc);
						todo_ball = (result.rows.item(il).ball == null) ? 0 : result.rows.item(il).ball;
						todo_teh = (result.rows.item(il).tehno == null) ? '' : '<b>'+result.rows.item(il).tehno+':</b> ';
						total_work = total_work + parseFloat(todo_ball);
						$table1.append(
							'<tr id="row_'+todo_id+'" data-id="'+todo_id+'">'+
								'<td id="td_desc_'+todo_id+'">'+ todo_date+'</td>'+
								'<td>'+ todo_ls+'</td>'+
								'<td>'+ todo_teh+todo_desc+'</td>'+
								'<td>'+ todo_ball+'</td>'+
								'<td>'+
								'<button type="button" class="del btn btn-default btn-xs"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>'+
								'</td>'+
							'</tr>');

					}
					$('#total_s').html(total_work.toFixed(2));
				});
			});
		setTimeout(function(){
			deleteClickWorkOn();
		}, 200);
	}
	
	//Конец Наряды

	
    $("#addTehno").click(function() {
		speckyboy.init.addTehno();
    });
	
    $("#buttonqqq").click(function() {
		if($( "#div_edit_ball" ).css('display') == 'block'){
			$( "#div_edit_ball" ).hide('blind', {}, 500, '' );
		}
		if($( "#div_add_ball" ).css('display') == 'block'){
			$( "#div_add_ball" ).hide('blind', {}, 500, '' );
			$("#buttonqqq span").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
		}else{
			$("#buttonqqq span").removeClass("glyphicon-chevron-down");
			$("#buttonqqq span").addClass("glyphicon-chevron-up");
			$( "#div_add_ball" ).show('blind', {}, 500, '' );
		}
    });
    function editClickOn() {
			$(".edit")
				.click(function() {
					var $thisTr = $(this).parent().parent(),
						timeID = $thisTr.data("id"),
						oldid = parseFloat($('#edit_id').html());
						speckyboy.init.editRowBall(timeID);
						if($( "#div_add_ball" ).css('display') == 'block'){
							$( "#div_add_ball" ).hide('blind', {}, 500, '' );
							$("#buttonqqq span").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
						}
						if (timeID == oldid){
							if($( "#div_edit_ball" ).css('display') == 'block'){
								$("#div_edit_ball").hide('blind', {}, 500, '' );
							}else{
								$("#div_edit_ball").show('blind', {}, 500, '' );
							}
							
						}else{
							if($( "#div_edit_ball" ).css('display') == 'block'){
							}else{
								$("#div_edit_ball").show('blind', {}, 500, '' );
							}
						}
        });
    }
	

	$('.navbar-collapse li').click(function() {
		$ddd = $(this).data('id');
		$('.navbar-collapse').collapse('hide');
		
		if($ddd != 'settings'){
			
			$("#div_add_ball").hide('blind', {}, 500, '' );
			$("#div_edit_ball").hide('blind', {}, 500, '' );
			$("#buttonqqq span").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
		}
	});
	$( ".add_close" ).click(function() {
		$('#Modal_add').modal('hide'); 
	});
	$( "#edit_save_ball" ).click(function() {
		id = $('#edit_id').html();
		desc = $('#edit_desc').val();
		ball = $('#edit_ball').val();
		speckyboy.init.editSaveBall(id, desc, ball);
		$("#td_ball_desc_"+id).html(desc);
		$("#td_ball_ball_"+id).html(ball);
		$("#div_edit_ball").toggle('blind', {}, 500 );
	});
	$(".edit_ball_close").click(function() {
		$("#div_add_ball").hide('blind', {}, 500, '' );
		$("#div_edit_ball").hide('blind', {}, 500, '' );
		$("#buttonqqq span").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-up");
		$('#Modal_edit').modal('hide'); 
	});
	$("#add").click(function() {
		var val1 = $("#desc").val();
		var val2 = $("#ball").val();
		speckyboy.init.addBall(val1,val2);
		$('#Modal_add').modal('hide');
		$("#desc").val('');
		$("#ball").val('');
	});

	
	function show_desc(desc){
		var desc_arr = $.parseJSON(desc);
		if(!desc_arr){
			res = '';
		}else{
			res = '';
			var zp = ', '
			for (var di=0; di < desc_arr.length; di++) {
				if(di+1 === desc_arr.length){
					zp = '';
				}
				res = res + ''+desc_arr[di].desc+' <span class="label label-success">'+desc_arr[di].ball+'</span>'+zp;
			}
		}
	return res;
	}
    function deleteClickOn() {
			$( ".del_ball")
				.click(function() {
            var $thisTr = $(this).parent().parent(),
                timeID = $thisTr.data("id");
				$tttt = $("#row_ball_"+timeID);
            speckyboy.init.deleteRow(timeID, 'balls') 
			$tttt.fadeOut()
        })
    }
    function deleteItem(timeID) {
        var clbObj = $.parseJSON(localStorage.ball),
            newObj = {},
            newVal = {};
        return newObj = [], $.each(clbObj, function(ind, val) {
            val.id != timeID && (newVal = {}, newVal.id = val.id, newVal.desc = val.desc, newVal.ball = val.ball, newObj.push(newVal))
        }), localStorage.ball = JSON.stringify(newObj), !0
    }

	Array.prototype.uniq = function(){
	  return this.filter(
		function(a){
			return !this[a] ? this[a] = true : false;
		},
		{}
	  );
	}	
	// Функция аналогичная php функции inArray
	inArray = Array.prototype.indexOf ?
		function (arr, val) {
			return arr.indexOf(val) != -1
		}:
		function (arr, val) {
			var i = arr.length
			while (i--) {
				if (arr[i] === val) return true
			}
			return false
		}

	speckyboy.init.open();
	speckyboy.init.createTable();
	speckyboy.init.getWork();
	speckyboy.init.getBall();
	});