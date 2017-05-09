var url = null,
    myFriends = [];

var log = function (str) {
        console.log(str);
    },
    urlUpdate = function () {
        chrome.tabs.query({'active': true}, function (tabs) {
            url = tabs[0].url;
        });
    },
    dataGet = function () {
        chrome.storage.sync.get("friendData", function (items) {
            for (var i in items.friendData) {
                myFriends.push(items.friendData[i]);
            }
            dataCheck();
            dataUpdate();
        });

    },
    dataSet = function () {
        chrome.storage.sync.set({"friendData": myFriends});
    },
    dataCheck = function () {
        if (jQuery.isEmptyObject(myFriends)) {
            $('.ifEmpty').show();
            $('.sendtoall').hide();
        } else {
            $('.ifEmpty').hide();
            $('.sendtoall').show();
        }
    },
    dataUpdate = function () {
        var str = '';
        $('.list.friends ul').html("");
        if (!jQuery.isEmptyObject(myFriends)) {
            for (var k in myFriends) {
                
                    str = '<li data-id="' + myFriends[k].id + '"><a href="#" title="' + myFriends[k].email + '" class="ico arrow">';
                    str += myFriends[k].name;
                    str += '</a><a href="#" class="ico remove">Remove</a></li>';
                    $('.list.friends ul').append(str);
                
            }
            $('.list.friends li .remove').click(function () {
                var dataid = $(this).parents('li:first').attr('data-id');
                var newData = [];
                for (var k in myFriends) {
                    
                        if (myFriends[k].id != dataid) {
                            newData.push(myFriends[k]);
                        }
                    
                }
                myFriends = newData;
                dataUpdate();
                dataSet();
                dataCheck();
            });
            $('.list.friends li .arrow').click(function () {
                var dataid = $(this).parents('li:first').attr('data-id');
                var toData = [];
                for (var k in myFriends) {
                    
                        if (myFriends[k].id == dataid) {
                            toData.push(myFriends[k]);
                        }
                    
                }
                if( !jQuery.isEmptyObject(toData) ){
                    send(toData);
                }
            });
        }
    },
    isEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
	
	$('.add-friend-form button').click(function () {
    var name = $('#name').val();
    var email = $('#email').val();


    if (isEmail(email)) {
        if (name == '') {
            name = email;
        }
        var max = 0;
        for (var k in myFriends) {
            
                if (myFriends[k].id > max) {
                    max = myFriends[k].id;
                }
            
        }

        var obj = {};
        obj.id = max + 1;
        obj.name = name;
        obj.email = email;
        myFriends.push(obj);
        dataSet();
        dataUpdate();
        dataCheck();
        $('#name').val('');
        $('#email').val('');
        $('#turnback').click();
    } else {
        alert("E-mail is incorrect!");
    }
});

$('#addFriend').click(function () {
    $('.panel1').hide();
    $('.panel3').hide();
    $('.panel2').show();
});
$('#mySettings').click(function () {
    $('.panel1').hide();
    $('.panel2').hide();
    $('.panel3').show();
});

$('#turnback,#turnback2').click(function () {
    $('.panel3').hide();
    $('.panel2').hide();
    $('.panel1').show();
});


$('.sendtoall').click(function () {
    $('.sendtoall').hide();
    send(myFriends);
});

var send = function(listToSend){
    urlUpdate();
    var sendData = {
        myname: localStorage["myname"],
        myemail: localStorage["myemail"],
        url: url,
        todata: listToSend
    };
    $.ajax({
        type: "POST",
        url: 'http://aertas.com/kankaext/kankayasend.php',
        data: sendData,
        success: function () {
            alert("Successful");
			$('.sendtoall').show();
        }
    });

};



$('.settings-form button').click(function () {
    localStorage["myname"] = $('#myname').val();
    localStorage["myemail"] = $('#myemail').val();
    $('#turnback2').click();
});



$(function () {
    urlUpdate();
    dataGet();
    $('#myname').val(localStorage["myname"]);
    $('#myemail').val(localStorage["myemail"]);

});


