/**
 * Created by anderson.santos on 03/03/2017.
 */
var EachAsync = function(array,processItem,allDone){
    var length = array.length;
    var recurse = function(index){
        var itemDone = function(cancel){
            if(!cancel){
                if(index<length-1){
                    recurse(index+1);
                }
                else{
                    allDone(array,false);
                }
            }
            else{
                allDone(array,true);
            }
        };
        processItem(array[index],itemDone,index,array);
    };
    recurse(0);
};


(function(){
    var pessoas = [
        {nome:"josé", idade:20},
        {nome:"ana", idade:30},
        {nome:"maria", idade:40},
        {nome:"laura", idade:50},
        {nome:"pedro", idade:60}
    ];

    EachAsync(pessoas,function(p,itemDone){
        setTimeout(function(){
            console.log("Processando pessoa " + p.nome);
            itemDone(p.idade > 30);
        },3000);

    }, function(){
        console.log("Todas as pessoas foram processadas");
    });
    console.log("Iniciado o processamento das pessoas");
})();