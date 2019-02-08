document.querySelector("#startGame").addEventListener("click", function(){
    startGame(document.querySelector('input[name="boardSize"]:checked').value);
})

function hideTitle(){
    document.getElementById("divTitle").setAttribute("style","display:none");
}

function setMargins(boardSize){
 //wrapper stying
 //rest should be classes
    if (boardSize === 12){styleMe("200px","300px","250px","1fr 1fr 1fr 1fr");}
    else if (boardSize === 16){styleMe("150px","200px","250px","1fr 1fr 1fr 1fr"); }
    else if (boardSize === 24){styleMe("100px","50px","50px","1fr 1fr 1fr 1fr 1fr 1fr"); }
    else {styleMe("100px","50px","50px","1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"); }

    function styleMe(size, outerMargin,rowGap,rows){
        var wrapper = document.getElementById("wrapper");
        var cardImg = document.querySelectorAll(".card img");
        wrapper.style.marginLeft = outerMargin;
        //?wrapper.style.gridRowGap = rowGap;
        cardImg.forEach(x => {x.setAttribute('width', size)});
        cardImg.forEach(x => {x.setAttribute('heigth', size)});
        wrapper.setAttribute("grid-template-columns",rows);
    }
    
}
function startGame(boardSize){
    hideTitle();
    var points = 0;
    displayPoints(points);
    var turn = 0;
    displayTurn(null);
    drawThePieces(boardSize, points, turn);
    setMargins(boardSize);

    //waiting for user click
    //timer?
}

function displayPoints(points){
    document.querySelector("#points").textContent = `${points} pts`;
}

function displayTurn(turn){
    if (turn === null){
        document.querySelector("#turn").textContent = "";
    } else {
        document.querySelector("#turn").textContent = `Turn ${turn}`;
    }
}

function drawThePieces(boardSize, points, turn){
    //for each picture, put it at the alloated space
    var pictures = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg"];
    var picturesObject = {};

    htmlContent= "<div id='wrapper'>";

    var usedPictures = pictures.slice(0,boardSize/2);
    usedPictures.push.apply(usedPictures, usedPictures);
    
    for (let i = 1; i <= boardSize; i++) {
        //randomly choose a picture
        var picLocationInArray = Math.floor(Math.random() * usedPictures.length);
        
        picturesObject[i] = usedPictures[picLocationInArray];

        htmlContent+= "<div class='card' id="+ i +" ontouchstart='this.classList.toggle(\"hover\")'><img id='back"+ i +"'src='img/" + usedPictures[picLocationInArray] + "' ><img id='front"+ i +"' src='img/front.jpg' id='front"+ i +"' style='visibility:visible'></div>";
        
        usedPictures.splice(picLocationInArray,1);
    } htmlContent += "</div>";
    
    document.querySelector("#memo").innerHTML = htmlContent;
    updateEvents(boardSize,picturesObject, points, turn, false)
}

function updateEvents(boardSize, picturesObject, points, turn, pieceFlipped){
    
    var arr = [];
    for (let i=1; i<=boardSize;i++){
        arr.push(i);
    }
    
    arr.forEach(x => {
        document.getElementById('front'+x).onclick = function() {
            pieceIsClicked(boardSize, picturesObject,x, points, turn, pieceFlipped);
        }
        /*document.getElementById('front'+x).removeEventListener("click", function(){
            pieceIsClicked(picturesObject,x, points, turn, false);
        })
        document.getElementById('front'+x).addEventListener("click", function(){
            pieceIsClicked(picturesObject,x, points, turn, pieceFlipped);
        })*/
    });
}

function foundAPair(boardSize,picturesObject, points, turn, pieceFlipped){
    points = addPoints(points);
    disappearPieces(pieceNumber,pieceFlipped);
    updateEvents(boardSize,picturesObject, points, turn, pieceFlipped);
}
function noPair(boardSize,picturesObject, points, turn, pieceFlipped){
    
}

function pieceIsClicked(boardSize,picturesObject,pieceNumber, points, turn, pieceFlipped){
    
    flipPiece(pieceNumber);
    //var that checks how many pairs left till game end. or from points?
    
    //this is the first piece visible
    if (pieceFlipped === false){
        turn = nextTurn(turn);
        var pieceFlipped = pieceNumber;
        updateEvents(boardSize,picturesObject, points, turn, pieceFlipped);
        
    } 
    //a piece is already visible
    else {
        //clicked a different piece than previously
        if (pieceNumber !== pieceFlipped){
            //a pair
            if (picturesObject[pieceNumber] === picturesObject[pieceFlipped]){
                points = addPoints(points);
                if (points == 300*boardSize/2){
                    document.querySelector("#message").textContent= "Congratulations! You won!"
                }
                turn = nextTurn(turn);
                setTimeout(function() {
                disappearPieces(pieceNumber,pieceFlipped)}, 800);
                updateEvents(boardSize,picturesObject, points, turn, false);
                //check if that's the last pair
                console.log(points);
                
                
            } else {
                turn = nextTurn(turn);
                setTimeout(function() {
                    turnPiecesBack(pieceNumber,pieceFlipped)}, 800);
                updateEvents(boardSize,picturesObject,points, turn, false);
                
            }
        } 
    }
}

function flipPiece(pieceNumber){
    //only turns pieces that were fronts
    if (document.getElementById("front" + pieceNumber).style.visibility = "visible"){
        //hides the front
        document.getElementById("front" + pieceNumber).setAttribute("style","visibility:hidden");
        //updates the object
    } 
}

function nextTurn(turn){
    //changes to next turn?
    turn += 1;
    displayTurn(turn);
    return turn;
}

function addPoints(points){
    //adds points for a pair and displays them
    points += 300;
    displayPoints(points);
    return points;
}

function turnPiecesBack(firstPiece,secondPiece){
    document.getElementById("front" + firstPiece).setAttribute("style","visibility:visible");
    document.getElementById("front" + secondPiece).setAttribute("style","visibility:visible");
    //turns pieces back
}

function disappearPieces(firstPiece,secondPiece){
    //makes pieces disappear from the board
    
    document.getElementById("front" + firstPiece).setAttribute("style","visibility:hidden");
    document.getElementById("back" + firstPiece).setAttribute("style","visibility:hidden");
    document.getElementById("front" + secondPiece).setAttribute("style","visibility:hidden");
    document.getElementById("back" + secondPiece).setAttribute("style","visibility:hidden");
}



