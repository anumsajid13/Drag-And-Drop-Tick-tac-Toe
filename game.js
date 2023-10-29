$(document).ready(function() {
    var countO=1;
    var countX=1;
    var gameBoard = ["", "", "", "", "", "", "", "", ""]; 
 //   var lockBoard = ["open", "open", "open", "open", "open", "open", "open", "open", "open"]; 
   
    var originalPositions = {};
    $(".mark").each(function() {
        var id = $(this).attr("id");
        originalPositions[id] = $(this).position();
        console.log("PositionTop: "+originalPositions[id].top +" id: "+id)
    });

    $('.refresh').click(function() {
        resetGame();
    });

    //|| (!isOTurn && $(this).text() === "O")
    var markid;
    $(".mark").draggable({
        revert: true,
        helper: "clone",
        start: function(){
            if ((isOTurn==true && $(this).text() === "X") || (isOTurn==false && $(this).text() === "O")) {
                
                return false;
            }    
            markerText1 = $(this).text();
            sourceCellIndex1 = $(this).closest(".block").attr("id");
            if (isSurroundedByOpponent(sourceCellIndex1, markerText1,gameBoard)) {
                $("#res").text("Invalid Move!");
                return false; // Prevent dragging if surrounded by it's opponenets
            }
            
            markid = $(this).attr("id");
         //   ui.helper[0].innerText = $(this).text();         
        }      
    });


    var isOTurn = true; 
        $(".block").droppable({
        accept: ".mark",
        drop: function(event, ui)
        
        {
            var blockId= $(this).attr("id");
         
            var marker = ui.helper[0].innerText;
            // Checking if the target block is empty before placing the marker
            if ($(this).children('.marker-in-grid').text() === "") {

                $(this).children('.marker-in-grid').text(marker);

            // Disable the draggable for the correct player's turn
            ui.helper.remove();
        
            console.log(marker);  

            if(marker=="O")
            {
                isOTurn=false;
            }
            else if(marker=="X")
            {
                isOTurn=true;
            }

            if(marker== "O" && countO==3)
            {
                $("#o3").css("display", "none");
                console.log("removed id: #o3");   
                countO++ 
               
            }
            if(marker== "O" && countO==2)
            {
                $("#o2").css("display", "none");
                console.log("removed id: #o2");   
                countO++ 
            
            }
            if(marker== "O" && countO==1)
            {
                $("#o1").css("display", "none");
                console.log("removed id: #o1");  
                countO++  
             
            }
          
            if(marker== "X" && countX==3)
            {
                $("#x3").css("display", "none");
                console.log("removed id: #x3"); 
                countX++
            }
            if(marker== "X" && countX==2)
            {
                $("#x2").css("display", "none");
                console.log("removed id: #x2"); 
                countX++   
             
            }
            if(marker== "X" && countX==1)
            {
                $("#x1").css("display", "none");
                console.log("removed id: #x1");  
                countX++  
            
            }
            
              // Update the game board
              var cellIndex = $(this).index(); //.index() is used to find the position of the element among it's siblings
              gameBoard[cellIndex] = marker;
  
             
                  setTimeout(function() {
                    console.log(gameBoard);
                    if (checkForWin(marker)) {
                       
                        $("#res").text("Player " + marker + " has won!");                      
                       
                    }
                    else{
                        if(marker=="O")
                        {
                            isOTurn=false;
                            $("#res").text("Its X Turn");
                        }
                        else if(marker=="X")
                        {
                            isOTurn=true;
                            $("#res").text("Its O Turn");
                        }

                         if(countO==4 && countX==4)
                            {    
                                var gameBoard2 = gameBoard;
                                var markerText="";
                                var sourceCellIndex;
                                //now next draggable function 
                                $(".marker-in-grid").draggable({
                                    revert: "invalid",
                                    helper: "clone",
                                    start: function() {
                                         markerText = $(this).text();
                                         sourceCellIndex = $(this).closest(".block").attr("id");
                                        if ((isOTurn && markerText === "X") || (!isOTurn && markerText === "O")) {
                                           
                                            return false; // Disable dragging for the wrong player's turn
                                        }
                                      
                                        if (isSurroundedByOpponent(sourceCellIndex, markerText,gameBoard2)) {
                                            $("#res").text("Invalid Move!");
                                            return false; // Prevent dragging if surrounded
                                        }
                                      
                                        $(this).text("");
                                       
                                        console.log("source Index: "+sourceCellIndex)
                                        gameBoard2[sourceCellIndex] = "";



                                    }
                                });

                                $(".block").droppable({
                                    accept: ".marker-in-grid",  
                                    drop: function(event, ui) {
                                    
                                        var marker = ui.helper[0].innerText;
                                    
                                         $(ui.helper).empty();
                                       
                                        $(this).find('.marker-in-grid').text(marker);        
                                        ui.helper.remove();
                                        console.log(marker);

                                        if(marker=="O")
                                        {
                                            isOTurn=false;
                                           
                                        }
                                        else if(marker=="X")
                                        {
                                            isOTurn=true;
                                          
                                        }
                                
                                        
                                        // Update the game board
                                        var cellIndex = $(this).attr("id");
                                        console.log("Target Index: "+cellIndex)
                                        gameBoard2[cellIndex] = marker;
                                

                                        setTimeout(function() {
                                            // Check for a win
                                            if (checkForWin2(marker,gameBoard2)) {
                                              
                                               $("#res").text("Player " + marker + " has won!");
                                                isGameOver = true; // Set the game over flag
                                                
                                            } else {
                                                if(marker=="O")
                                                {
                                                    isOTurn=false;
                                                    $("#res").text("Its X Turn");
                                                }
                                                else if(marker=="X")
                                                {
                                                    isOTurn=true;
                                                    $("#res").text("Its O Turn");
                                                }
                                            }
                                        }, 1000);
                                    }
                                });
                        
                            }

                     }
                    }, 1000); 
            }  

                
            function checkForWin2(player,gameBoard2) {
                var winningCombinations = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                    [0, 4, 8], [2, 4, 6]             // Diagonals
                ];

                console.log(gameBoard2);
                for (var i = 0; i < winningCombinations.length; i++) {
                    var [a, b, c] = winningCombinations[i];

                    console.log("inside checkWin: "+gameBoard2[a] +" "+gameBoard2[b]+" "+gameBoard2[c] )
                    if (gameBoard2[a] === player && gameBoard2[b] === player && gameBoard2[c] === player) {
                        $(".block#" + a + " .marker-in-grid").css("background-color", "#a59b9b");
                         $(".block#" + b + " .marker-in-grid").css("background-color", "#a59b9b");
                         $(".block#" + c + " .marker-in-grid").css("background-color", "#a59b9b");
                        $(".block#"+a).css("background-color", "#a59b9b");
                        $(".block#"+b).css("background-color", "#a59b9b");
                        $(".block#"+c).css("background-color", "#a59b9b");
                       
                      return true; // Player has won
                    }
                }

                return false; // No winner yet
            }
              

                  // Function to check for a win
            function checkForWin(player) {
                var winningCombinations = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                    [0, 4, 8], [2, 4, 6]             // Diagonals
                ];

                console.log(gameBoard);
                for (var i = 0; i < winningCombinations.length; i++) {
                    var [a, b, c] = winningCombinations[i];

                    console.log("inside checkWin: "+gameBoard[a] +" "+gameBoard[b]+" "+gameBoard[c] )
                    if (gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player) {
                         $(".block#" + a + " .marker-in-grid").css("background-color", "#165c25");
                         $(".block#" + b + " .marker-in-grid").css("background-color", "#165c25");
                         $(".block#" + c + " .marker-in-grid").css("background-color", "#165c25");
                        $(".block#"+a).css("background-color", "#165c25");
                        $(".block#"+b).css("background-color", "#165c25");
                        $(".block#"+c).css("background-color", "#165c25");
                        return true; // Player has won
                    }
                }

                return false; // No winner yet
            }

           
        }
    });

  

    function isSurroundedByOpponent(sourceCellIndex, markerText,gameBoard2) {
                    
        console.log("Source Cell Index:: "+sourceCellIndex)
        console.log("Marker Text:: "+markerText)

       
        var Move=true;
        if(sourceCellIndex==0)
        {
            
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[1]=="O" && gameBoard2[3]=="O" && gameBoard2[4]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[1]=="X" && gameBoard2[3]=="X" && gameBoard2[4]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==1)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[0]=="O" && gameBoard2[2]=="O" && gameBoard2[4]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[0]=="X" && gameBoard2[2]=="X" && gameBoard2[4]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==2)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[1]=="O" && gameBoard2[4]=="O" && gameBoard2[5]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[1]=="X" && gameBoard2[4]=="X" && gameBoard2[5]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==3)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[0]=="O" && gameBoard2[4]=="O" && gameBoard2[6]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[0]=="X" && gameBoard2[4]=="X" && gameBoard2[6]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==4)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[1]=="O" && gameBoard2[3]=="O" && gameBoard2[5]=="O" && gameBoard2[7]=="O")
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[1]=="X" && gameBoard2[3]=="X" && gameBoard2[5]=="X" && gameBoard2[7]=="X")
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==5)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[2]=="O" && gameBoard2[4]=="O" && gameBoard2[8]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[2]=="X" && gameBoard2[4]=="X" && gameBoard2[8]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==6)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[7]=="O" && gameBoard2[3]=="O" && gameBoard2[4]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[7]=="X" && gameBoard2[3]=="X" && gameBoard2[4]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==7)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[6]=="O" && gameBoard2[8]=="O" && gameBoard2[4]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[6]=="X" && gameBoard2[8]=="X" && gameBoard2[4]=="X" )
                {
                    Move=false;
                }
            }
        }
        else if(sourceCellIndex==8)
        {
           
            var opponent;                  
            if (markerText=="X")
            {
                opponent="O";
                if(gameBoard2[7]=="O" && gameBoard2[5]=="O" && gameBoard2[4]=="O" )
                {
                    Move=false;
                }
            }
            if (markerText=="O")
            {
                opponent="X";
                if(gameBoard2[7]=="X" && gameBoard2[5]=="X" && gameBoard2[4]=="X" )
                {
                    Move=false;
                }
            }
        }

        
     
        console.log("Move" + Move);
        if(Move==true)
        {

            return false; //dont block
        }
        if(Move==false)
        {
            return true;//block
        }                   

    }
    
    function resetGame() {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        gameBoard2 = ["", "", "", "", "", "", "", "", ""];
        countO = 1;
        countX = 1;
        isOTurn = true; 
       // $(".block").text(""); // Clear the board
       $(".block").children('.marker-in-grid').text("");
       
        $(".mark").each(function() {
            var id = $(this).attr("id");
            console.log(" reset PositionTop: "+originalPositions[id].top +" id: "+id)
           
            $(this).css({
                top: originalPositions[id].top,
                left: originalPositions[id].left
            });

            $(this).css("display", "block"); // Reset the display of "X" and "O"
        });
        $(".block").each(function() {
            $(this).find(".marker-in-grid").css("background-color", "##8a0d0d");
            $(this).css("background-color", "##8a0d0d");
        });
        
        $("#res").text("Its O Turn");
        
    }

});
