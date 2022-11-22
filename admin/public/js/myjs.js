$(document).on('click','#logout',function(){
    if(confirm("Are you sure you want to Logout ?")){
        $.post("/admin/logout",function(data){
            if(data === 'success'){
                window.location.href="/admin/login";
            }else{
                alert("Sorry! Somthing went wrong");
            }
        });
    }
});