document.addEventListener('DOMContentLoaded', function(){ 
    document.querySelector(".check") .addEventListener("click", myFoo);

function myFoo()

{

    if (document.querySelector(".check").checked){
        document.querySelector('.order').style.display = 'none';
        document.querySelector('.order.order_2').style.display = 'block';

    }else{
        document.querySelector('.order').style.display = 'block';
        document.querySelector('.order.order_2').style.display = 'none';
    }
};
});
