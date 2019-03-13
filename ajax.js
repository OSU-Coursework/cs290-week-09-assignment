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

$(document).ready(() => {
    $('#dataSubmit').click(() =>{
    
        $.ajax({
            url: 'insert/',
            type: 'POST',
            dataType: 'json',
            success: ()=> {
                console.log('successfully recorded the following:', data);
            }
        });

    });
});

$(document).ready(() => {
    $('#edit').click(() =>{

        $.ajax({
            url: 'simple-update/',
            type: 'get',
            dataType: 'json',
            success: ()=> {
                console.log('successfully edited data:', data);
            }
        });

    });
});

$(document).ready(() => {
    $('#delete').click(() =>{
        
        $.ajax({
            url: 'delete/',
            type: 'GET',
            dataType: 'json',
            success: ()=> {
                console.log('successfully deleted entry:', data);
            }
        });

    });
});
