// main home page
$(document).ready(() => {
        
    $.ajax({
        url: '/',
        type: 'GET',
        dataType: 'json',
        success: (data)=> {
            console.log('successfully retrieved data for display:', data);
        }
    });

});

// ajas post for inserting data
$(document).ready(() => {
    $('#dataSubmit').click(() =>{
    
        $.ajax({
            url: 'insert/',
            type: 'POST',
            dataType: 'json',
	    data: {
                name: $('#name').val(),
                reps: $('#reps').val(),
                weight: $('#weight').val(),
                date: $('#date').val(),
                lbs: $('#lbs').val()
            },
            success: (data)=> {
                console.log('successfully recorded the following:', data);
            }
        });

    });
});

// ajax post request for editing data
$(document).ready(() => {
    $('#dataEdit').click(() =>{
    
        $.ajax({
            url: 'simple-update/',
            type: 'POST',
            dataType: 'json',
	    data: {
                name: $('#name').val(),
                reps: $('#reps').val(),
                weight: $('#weight').val(),
                date: $('#date').val(),
                lbs: $('#lbs').val(),
                id: $('#id').val()
            },
            success: (data)=> {
                console.log('successfully recorded the following:', data);
            }
        });

    });
});

// ajax get request for deleting data (should probably be a post but it's okay)
$(document).ready(() => {
    $('#delete').click(() =>{
        itemid = $(this).attr('dbId'); 
        $.ajax({
            url: 'delete?id=' + itemid,
            type: 'GET',
            dataType: 'json',
            //data: {
            //    id: $('#dbid').val()
            //},
            success: ()=> {
                console.log('successfully deleted entry:', data);
            }
        });

    });
});
