
var squares = document.querySelectorAll(".square");
var board = document.querySelector(".board");
var wrap = document.querySelector(".wrap");
board.oncontextmenu = ()=>{return false;}
var enmKing = document.getElementById("blackKing");
var myKing = document.getElementById("whiteKing");
var wlRook = document.getElementById("leftRookWhite"),
    wrRook = document.getElementById("rightRookWhite"),
    whtKng = document.getElementById("whiteKing"),
    blRook = document.getElementById("leftRookBlack"),
    brRook = document.getElementById("rightRookBlack"),
    blckKng = document.getElementById("blackKing"),
    a1 = document.getElementById("a1"),
    a8 = document.getElementById("a8"),
    d1 = document.getElementById("d1"),
    d8 = document.getElementById("d8"),
    f1 = document.getElementById("f1"),
    f8 = document.getElementById("f8"),
    h1 = document.getElementById("h1"),
    h8 = document.getElementById("h8");
var checkLine = [];
var threatLine = [];
var kingLine = [];
var addedKingBlocks = [];
var envOfKing = [];
var envOfInTurnKing = [];
var letters9 = ["a", "b", "c", "d", "e", "f","g","h"];
var wideAry2 = [];



var fullSq = document.querySelectorAll(".full");

for (var j = 0; j < fullSq.length; j++) {
  dragElement(fullSq[j].querySelector("img"));                                  // giving dragging skill to every pieces
}


var rect, firstX, firstY, firstSq, pieceColor, turn = "white";

function dragElement(elmnt) {

    elmnt.onmousedown = dragMouseDown;                                          // when the piece mousedowned

  function dragMouseDown(e) {

    if (elmnt.getAttribute("data-color") == turn) {
      e = e || window.event;
      e.preventDefault();

      rect = board.getBoundingClientRect();
      firstX = e.clientX - rect.left;                                             // calculating the margin of cursor according to board
      firstY = e.clientY - rect.top;

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;                                         // while mousedowned, these are the up and move functions

      elmnt.classList.add("activePiece");
      elmnt.parentElement.classList.add("activeSquare");                          // giving opacity, z-index and inset box shadow
      firstSq = elmnt.parentElement;

      dragPiece(elmnt); // all the square functions


    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    var posx = (e.clientX - rect.left) - firstX;                                // calculating the posisiton x and y which the piece will take
    var posy = (e.clientY - rect.top) - firstY;

    elmnt.setAttribute("style","top:"+(posy)+"px; left:"+(posx)+"px");          // movement of piece

    for (var r = 0; r < squares.length; r++) {
      if (elmnt.parentElement != squares[r]) {
        squares[r].onmouseover = function(){
          this.classList.add("hoverBorder");                                    // every squares' (except main square) dragover function
        }
        squares[r].onmouseout = function(){
          this.classList.remove("hoverBorder");
        }
      }
    }

  }


  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    appendPiece(elmnt,event);                                                   // replacing the piece
    makeSquaresDefault();                                                       // making every square default
    elmnt.classList.remove("activePiece");                                      // dragged piece is no longer activePiece


  }
}



function makeSquaresDefault(){
  for (var r = 0; r < squares.length; r++) {
      squares[r].onmouseover = null;
      squares[r].onmouseout = null;                                             // making every square default function
      squares[r].classList.remove("activeSquare");
      squares[r].classList.remove("hoverBorder");
      squares[r].querySelector(".circle").classList.remove("showCircle");       // making propriate circles invisible
  }
}




    function dragPiece(elmnt){
      var thisSquare = elmnt.parentElement.getAttribute("data-name");           // active piece's square name
      var thisPiece = elmnt.getAttribute("data-piece") - 1;                     // active piece's piece number
      var posSq = 0;

      for (var gd = 0; gd < movement[0].length; gd++) { if(sqNames[gd] == thisSquare){posSq = gd;}} // finding the right array for prop squares

      var propSq = movement[thisPiece][posSq];                                          // showing propriate squares for piece by circles

      for (var vt = 0; vt < propSq.length; vt++) {
        for (var bd = 0; bd < squares.length; bd++) {
          if (propSq[vt] == squares[bd].getAttribute("data-name") && squares[bd].querySelector(".circle")) {
            if (squares[bd].classList.contains("full")) {
              if (squares[bd].querySelector("img") && squares[bd].querySelector("img").getAttribute("data-color") != turn) {
                squares[bd].querySelector(".circle").classList.add("showCircle");                               // if the prop square has ally don't show circle
              }
            }else {
                squares[bd].querySelector(".circle").classList.add("showCircle");
            }
          }
        }
      }

      //--------------------------------------------------
      //--------------------------------------------------


      var sqLetter = thisSquare.substr(0,1);
      var sqNumber = thisSquare.substr(1,1);
      var letters = ["a","b","c","d","e","f","g","h"];
      var letterLine = letters.indexOf(sqLetter);
      var tmpNumber;




      if (thisPiece == 5) {

        tmpNumber = parseInt(sqNumber) + 1;

        if (document.getElementById((letters[letterLine-1] + tmpNumber).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine-1] + tmpNumber).toString());
          if (diagSq && diagSq.classList.contains("full") == false) {                                          // top-left diagonal checking
            diagSq.querySelector(".circle").classList.remove("showCircle");
          }
        }

        if (document.getElementById((letters[letterLine+1] + tmpNumber).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine+1] + tmpNumber).toString());     // top-right diagonal checking
          if (diagSq && diagSq.classList.contains("full") == false) {
            diagSq.querySelector(".circle").classList.remove("showCircle");
          }
        }

        if (document.getElementById((letters[letterLine] + tmpNumber).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine] + tmpNumber).toString());     // forward checking
          if (diagSq && diagSq.classList.contains("full")) {
            diagSq.querySelector(".circle").classList.remove("showCircle");
          }
        }

        if (elmnt.getAttribute("data-fm") == "true" && document.getElementById((letters[letterLine] + (tmpNumber+1)).toString()) && document.getElementById((letters[letterLine] + (tmpNumber+1)).toString()).classList.contains("full")) {
          document.getElementById((letters[letterLine] + (tmpNumber+1)).toString()).querySelector(".circle").classList.remove("showCircle");             // can't take 2 sq forward at first
        }


        if (document.getElementById((letters[letterLine-1] + (tmpNumber-1)).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine-1] + (tmpNumber-1)).toString());
          if (diagSq && diagSq.classList.contains("full") && diagSq.querySelector("img").getAttribute("data-fm") == "false") {                                          // first move taking over left rule
            document.getElementById((letters[letterLine-1] + tmpNumber).toString()).querySelector(".circle").classList.add("showCircle");
          }
        }

        if (document.getElementById((letters[letterLine+1] + (tmpNumber-1)).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine+1] + (tmpNumber-1)).toString());
          if (diagSq && diagSq.classList.contains("full") && diagSq.querySelector("img").getAttribute("data-fm") == "false") {                                          // first move taking over right rule
            document.getElementById((letters[letterLine+1] + tmpNumber).toString()).querySelector(".circle").classList.add("showCircle");
          }
        }

      }


      if (thisPiece == 6) {

        tmpNumber2 = parseInt(sqNumber) - 1;

        if (document.getElementById((letters[letterLine-1] + tmpNumber2).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine-1] + tmpNumber2).toString());
          if (diagSq && diagSq.classList.contains("full") == false) {                                          // bottom-left diagonal checking
            diagSq.querySelector(".circle").classList.remove("showCircle");
          }
        }

        if (document.getElementById((letters[letterLine+1] + tmpNumber2).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine+1] + tmpNumber2).toString());     // bottom-right diagonal checking
          if (diagSq && diagSq.classList.contains("full") == false) {
            diagSq.querySelector(".circle").classList.remove("showCircle");
          }
        }

        if (document.getElementById((letters[letterLine] + tmpNumber2).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine] + tmpNumber2).toString());     // forward checking
          if (diagSq && diagSq.classList.contains("full")) {
            diagSq.querySelector(".circle").classList.remove("showCircle");
          }
        }

        if (elmnt.getAttribute("data-fm") == "true" && document.getElementById((letters[letterLine] + (tmpNumber2-1)).toString()) && document.getElementById((letters[letterLine] + (tmpNumber2-1)).toString()).classList.contains("full")) {
          document.getElementById((letters[letterLine] + (tmpNumber2-1)).toString()).querySelector(".circle").classList.remove("showCircle");             // can't take 2 sq forward at first
        }

        if (document.getElementById((letters[letterLine-1] + (tmpNumber2+1)).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine-1] + (tmpNumber2+1)).toString());
          if (diagSq && diagSq.classList.contains("full") && diagSq.querySelector("img").getAttribute("data-fm") == "false") {                                          // first move taking over left rule
            document.getElementById((letters[letterLine-1] + tmpNumber2).toString()).querySelector(".circle").classList.add("showCircle");
          }
        }

        if (document.getElementById((letters[letterLine+1] + (tmpNumber2+1)).toString()) != null) {
          var diagSq = document.getElementById((letters[letterLine+1] + (tmpNumber2+1)).toString());
          if (diagSq && diagSq.classList.contains("full") && diagSq.querySelector("img").getAttribute("data-fm") == "false") {                                          // first move taking over right rule
            document.getElementById((letters[letterLine+1] + tmpNumber2).toString()).querySelector(".circle").classList.add("showCircle");
          }
        }

      }




        var isFound = false;
        for (var d1 = parseInt(sqNumber)+1; d1 < 9; d1++) {
          if (isFound == false) {
            var chckSq = document.getElementById(sqLetter + d1);
            if (chckSq.classList.contains("full")) {                                                            // top movement blocking

              if (chckSq.querySelector("img") == myKing && iteCh("bottom")) {
                deadlock("verticalLine");                        // if there is our King in front of us and an opponent behind us
              }

              isFound = true;
              for (var di = parseInt(d1)+1; di < 9; di++) {
                document.getElementById(sqLetter + di).querySelector(".circle").classList.remove("showCircle");
              }
            }
          }
        }

        var isFound2 = false;
        for (var d1 = parseInt(sqNumber)-1; d1 > 0; d1--) {
          if (isFound2 == false) {
            var chckSq = document.getElementById(sqLetter + d1);
            if (chckSq.classList.contains("full")) {                                                            // bottom movement blocking

              if (chckSq.querySelector("img") == myKing && iteCh("top")) {
                deadlock("verticalLine");                        // if there is our King behind us and an opponent in front of us
              }

              isFound2 = true;
              for (var di = parseInt(d1)-1; di > 0; di--) {
                document.getElementById(sqLetter + di).querySelector(".circle").classList.remove("showCircle");
              }
            }
          }
        }



        var isFound3 = false;

        for (var d1 = letterLine - 1; d1 >= 0; d1--) {
          if (isFound3 == false) {
            var chckSq = document.getElementById(letters[d1] + sqNumber);
            if (chckSq.classList.contains("full")) {                                                            // left movement blocking

              if (chckSq.querySelector("img") == myKing && iteCh("right")) {
                deadlock("horizontalLine");                        // if there is our King on the left side and an opponent on right
              }

              isFound3 = true;
              for (var di = d1 - 1; di >= 0; di--) {
                document.getElementById(letters[di] + sqNumber).querySelector(".circle").classList.remove("showCircle");
              }
            }
          }
        }


        var isFound4 = false;

        for (var d1 = letterLine + 1; d1 < 8; d1++) {
          if (isFound4 == false) {
            var chckSq = document.getElementById(letters[d1] + sqNumber);
            if (chckSq.classList.contains("full")) {                                                            // right movement blocking

              if (chckSq.querySelector("img") == myKing && iteCh("left")) {
                deadlock("horizontalLine");                        // if there is our King on the right side and an opponent on left
              }

              isFound4 = true;
              for (var di = d1+1; di < 8; di++) {
                document.getElementById(letters[di] + sqNumber).querySelector(".circle").classList.remove("showCircle");
              }
            }
          }
        }









        var isFound5 = false;
        tmpNumber = parseInt(sqNumber) + 1;

        for (var d1 = letterLine - 1; d1 >= 0; d1--) {
          if (isFound5 == false) {
            var chckSq = document.getElementById((letters[d1] + tmpNumber).toString());
            tmpNumber++;
            if (chckSq != null) {
              if (chckSq.classList.contains("full")) {                                                            // left-top diagonal movement blocking

                if (chckSq.querySelector("img") == myKing && iteCh("right-bottom")) {
                  deadlock("leftdiagonalLine");                        // if there is our King on the left-top diagonal and an opponent on opposite
                }

                isFound5 = true;
                for (var di = d1 - 1; di >= 0; di--) {
                  if (document.getElementById(letters[di] + tmpNumber)!=null) {
                    document.getElementById(letters[di] + tmpNumber).querySelector(".circle").classList.remove("showCircle");
                    tmpNumber++;
                  }
                }
              }
            }
          }
        }




        var isFound6 = false;
        tmpNumber = parseInt(sqNumber) - 1;

        for (var d1 = letterLine - 1; d1 >= 0; d1--) {
          if (isFound6 == false) {
            var chckSq = document.getElementById((letters[d1] + tmpNumber).toString());
            tmpNumber--;
            if (chckSq != null) {
              if (chckSq.classList.contains("full")) {                                                            // left-bottom diagonal movement blocking

                if (chckSq.querySelector("img") == myKing && iteCh("right-top")) {
                  deadlock("rightdiagonalLine");                        // if there is our King on the left-bottom diagonal and an opponent on opposite
                }

                isFound6 = true;
                for (var di = d1 - 1; di >= 0; di--) {
                  if (document.getElementById(letters[di] + tmpNumber)!=null) {
                    document.getElementById(letters[di] + tmpNumber).querySelector(".circle").classList.remove("showCircle");
                    tmpNumber--;
                  }
                }
              }
            }
          }
        }



        var isFound7 = false;
        tmpNumber = parseInt(sqNumber) - 1;

        for (var d1 = letterLine + 1; d1 < 9; d1++) {
          if (isFound7 == false) {
            var chckSq = document.getElementById((letters[d1] + tmpNumber).toString());
            tmpNumber--;
            if (chckSq != null) {
              if (chckSq.classList.contains("full")) {                                                            // right-bottom diagonal movement blocking

                if (chckSq.querySelector("img") == myKing && iteCh("left-top")) {
                  deadlock("leftdiagonalLine");                        // if there is our King on the right-bottom diagonal and an opponent on opposite
                }

                isFound7 = true;
                for (var di = d1 + 1; di < 9; di++) {
                  if (document.getElementById(letters[di] + tmpNumber)!=null) {
                    document.getElementById(letters[di] + tmpNumber).querySelector(".circle").classList.remove("showCircle");
                    tmpNumber--;
                  }
                }
              }
            }
          }
        }



        var isFound8 = false;
        tmpNumber = parseInt(sqNumber) + 1;

        for (var d1 = letterLine + 1; d1 < 9; d1++) {
          if (isFound8 == false) {
            var chckSq = document.getElementById((letters[d1] + tmpNumber).toString());
            tmpNumber++;
            if (chckSq != null) {
              if (chckSq.classList.contains("full")) {                                                            // right-top diagonal movement blocking

                if (chckSq.querySelector("img") == myKing && iteCh("left-bottom")) {
                  deadlock("rightdiagonalLine");                        // if there is our King on the right-top diagonal and an opponent on opposite
                }

                isFound8 = true;
                for (var di = d1 + 1; di < 9; di++) {
                  if (document.getElementById(letters[di] + tmpNumber)!=null) {
                    document.getElementById(letters[di] + tmpNumber).querySelector(".circle").classList.remove("showCircle");
                    tmpNumber++;
                  }
                }
              }
            }
          }
        }







      if (thisPiece == "4") {
        for (var gni = 0; gni < squares.length; gni++) {
          if (wideAry.includes(squares[gni].getAttribute("data-name"))){
            squares[gni].querySelector(".circle").classList.remove("showCircle");     // king cannot be located to the threated square
          }
        }

        for (var gni = 0; gni < squares.length; gni++) {
          if (ary1.includes(squares[gni].getAttribute("data-name"))) {
            squares[gni].querySelector(".circle").classList.remove("showCircle");     // kings cannot approach each other
          }
        }




        // finding all the threated squares
        lvzz = true;
        wideAry2 = [];
        for (var rsi = 0; rsi < squares.length; rsi++) {
          if (squares[rsi].querySelector("img") && squares[rsi].querySelector("img").getAttribute("data-color") != turn) {
            var tmPc2 = squares[rsi].querySelector("img");
            findNewSquares(tmPc2.getAttribute("data-piece"),squares[rsi]);
            var zzzAry = [leftAry, rightAry, topAry, bottomAry, ltDiagAry, lbDiagAry, rtDiagAry, rbDiagAry, knightAry, wPawnAry, bPawnAry];
            for (var tti = 0; tti < zzzAry.length; tti++) {
              for (var tdi = 0; tdi < zzzAry[tti].length; tdi++) {
                if (zzzAry[tti][tdi] != null) {
                  wideAry2.push(zzzAry[tti][tdi]);
                }
              }
            }
          }
        }
        lvzz = false;








          //white and black castling rule
        if ((whtKng) && (wrRook) && (whtKng.getAttribute("data-moved") == "false") && (wrRook.getAttribute("data-moved") == "false") && (document.getElementById("f1").classList.contains("full") == false) && (document.getElementById("g1").classList.contains("full") == false) && (wideAry2.includes("e1") == false) && (wideAry2.includes("f1") == false) && (wideAry2.includes("g1") == false) && (wideAry2.includes("h1") == false)) {
          document.getElementById("g1").querySelector(".circle").classList.add("showCircle");
        }
         if ((whtKng) && (wlRook) && (whtKng.getAttribute("data-moved") == "false") && (wlRook.getAttribute("data-moved") == "false") && (document.getElementById("d1").classList.contains("full") == false) && (document.getElementById("c1").classList.contains("full") == false) && (document.getElementById("b1").classList.contains("full") == false) && (wideAry2.includes("e1") == false) && (wideAry2.includes("d1") == false) && (wideAry2.includes("c1") == false) && (wideAry2.includes("b1") == false) && (wideAry2.includes("a1") == false)) {
          document.getElementById("c1").querySelector(".circle").classList.add("showCircle");
        }
         if ((blckKng) && (brRook) && (blckKng.getAttribute("data-moved") == "false") && (brRook.getAttribute("data-moved") == "false") && (document.getElementById("f8").classList.contains("full") == false) && (document.getElementById("g8").classList.contains("full") == false) && (wideAry2.includes("e8") == false) && (wideAry2.includes("f8") == false) && (wideAry2.includes("g8") == false) && (wideAry2.includes("h8") == false)) {
          document.getElementById("g8").querySelector(".circle").classList.add("showCircle");
        }
         if ((blckKng) && (blRook) && (blckKng.getAttribute("data-moved") == "false") && (blRook.getAttribute("data-moved") == "false") && (document.getElementById("d8").classList.contains("full") == false) && (document.getElementById("c8").classList.contains("full") == false) && (document.getElementById("b8").classList.contains("full") == false) && (wideAry2.includes("e8") == false) && (wideAry2.includes("d8") == false) && (wideAry2.includes("c8") == false) && (wideAry2.includes("b8") == false) && (wideAry2.includes("a8") == false)) {
          document.getElementById("c8").querySelector(".circle").classList.add("showCircle");
        }


      }


      //--------------------------------------------------
      //--------------------------------------------------

          // deadlock control


          function iteCh(dir) {   //controlling whether we're under the deadlock
            var control37 = false;

            switch (dir) {
              case "bottom":
                for (var ffi = parseInt(sqNumber)-1; ffi > 0; ffi--) {
                  var chckSq37 = document.getElementById(sqLetter + ffi);
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "1" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                }
                break;

                case "top":
                for (var ffi = parseInt(sqNumber)+1; ffi < 9; ffi++) {
                  var chckSq37 = document.getElementById(sqLetter + ffi);
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "1" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                }
                break;



                case "left":
                for (var ffi = letterLine-1; ffi >= 0; ffi--) {
                  var chckSq37 = document.getElementById(letters[ffi] + sqNumber);
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "1" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                }
                break;



                case "right":
                for (var ffi = letterLine+1; ffi <= 7; ffi++) {
                  var chckSq37 = document.getElementById(letters[ffi] + sqNumber);
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "1" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                }
                break;


                case "left-top":
                var tmpNumber137 = parseInt(sqNumber) + 1;
                for (var ffi = letterLine - 1; ffi >= 0; ffi--) {
                  var chckSq37 = document.getElementById((letters[ffi] + tmpNumber137).toString());
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "3" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                  tmpNumber137++;
                }
                break;



                case "left-bottom":
                var tmpNumber137 = parseInt(sqNumber) - 1;
                for (var ffi = letterLine - 1; ffi >= 0; ffi--) {
                  var chckSq37 = document.getElementById((letters[ffi] + tmpNumber137).toString());
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "3" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                  tmpNumber137--;
                }
                break;



                case "right-top":
                var tmpNumber137 = parseInt(sqNumber) + 1;
                for (var ffi = letterLine + 1; ffi < 8; ffi++) {
                  var chckSq37 = document.getElementById((letters[ffi] + tmpNumber137).toString());
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "3" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                  tmpNumber137++;
                }
                break;


                case "right-bottom":
                var tmpNumber137 = parseInt(sqNumber) - 1;
                for (var ffi = letterLine + 1; ffi < 8; ffi++) {
                  var chckSq37 = document.getElementById((letters[ffi] + tmpNumber137).toString());
                  if ((chckSq37) && (chckSq37.classList.contains("full")) && (chckSq37.querySelector("img").getAttribute("data-color") != turn) && (chckSq37.querySelector("img").getAttribute("data-piece") == "3" || chckSq37.querySelector("img").getAttribute("data-piece") == "4")) {
                    control37 = true;
                    break;
                  }else if (chckSq37 && chckSq37.classList.contains("full")) {
                    control37 = false;
                    break;
                  }
                  tmpNumber137--;
                }
                break;


            }

            return control37;
          }








          function deadlock(lockLine){

            switch(lockLine) {
              case "verticalLine":
                for (var fdi = 0; fdi < squares.length; fdi++) {
                  if ((squares[fdi].getAttribute("data-name").substr(0,1)).toString() != (sqLetter).toString()) {
                    squares[fdi].querySelector(".circle").classList.remove("showCircle");
                  }
                }
              break;


              case "horizontalLine":
                for (var fdi = 0; fdi < squares.length; fdi++) {
                  if (parseInt(squares[fdi].getAttribute("data-name").substr(1,1)) != parseInt(sqNumber)) {
                    squares[fdi].querySelector(".circle").classList.remove("showCircle");
                  }
                }
              break;


              case "leftdiagonalLine":
                findNewSquares("4",elmnt.parentElement);
                var mergedAry = ltDiagAry.concat(rbDiagAry);

                for (var fdi = 0; fdi < squares.length; fdi++) {
                  if (mergedAry.includes(squares[fdi].getAttribute("data-name")) == false) {
                    squares[fdi].querySelector(".circle").classList.remove("showCircle");
                  }
                }
              break;


              case "rightdiagonalLine":
                findNewSquares("4",elmnt.parentElement);
                var mergedAry = lbDiagAry.concat(rtDiagAry);

                for (var fdi = 0; fdi < squares.length; fdi++) {
                  if (mergedAry.includes(squares[fdi].getAttribute("data-name")) == false) {
                    squares[fdi].querySelector(".circle").classList.remove("showCircle");
                  }
                }
              break;

            }
          }



      //--------------------------------------------------
      //--------------------------------------------------

      // if the checkControl state is true, if it is checked we set the checked line so that we can edit the prop movements of pieces



      function checkControlFnc(xxx){
        threatLine = [], addedKingBlocks =[];
        ltrIncreasing = false;
        var tss1 = xxx.substr(0,1);   // threat square letter
        var tss2 = xxx.substr(1,1);   // threat square nmber
        var tks1 = thrtdKng.substr(0,1);    // thrtd king square letter
        var tks2 = thrtdKng.substr(1,1);    // thrtd king square nmber
        var bigNmb, smallNmb, bigLtr, smallLtr;

        if (document.getElementById(xxx).querySelector("img").getAttribute("data-piece") != "2") {    //if threat is not a knight

          if (parseInt(tss2) > parseInt(tks2)) {
            bigNmb = parseInt(tss2);
            smallNmb = parseInt(tks2);
          }else if (parseInt(tss2) < parseInt(tks2)){
            bigNmb = parseInt(tks2);
            smallNmb = parseInt(tss2);
          }

          if (letters.indexOf(tss1) > letters.indexOf(tks1)) {
            bigLtr = letters[letters.indexOf(tss1)];
            smallLtr = letters[letters.indexOf(tks1)];
          }else if (letters.indexOf(tks1) > letters.indexOf(tss1)){
            bigLtr = letters[letters.indexOf(tks1)];
            smallLtr = letters[letters.indexOf(tss1)];
          }


          if (tss1 == tks1) {                                                     // if threat line is vertical
            for (var gi = bigNmb; gi >= smallNmb; gi--) {
              threatLine.push(tss1 + gi.toString());
            }
            for (var cfi = 1; cfi < 9; cfi++) {
              addedKingBlocks.push(tss1 + cfi.toString());
            }
          }else if (tss2 == tks2){                                                // if threat line is horizontal
            for (var gi = letters.indexOf(bigLtr); gi >= letters.indexOf(smallLtr); gi--) {
              threatLine.push(letters[gi] + tss2);
            }
            for (var cfi = 0; cfi < 8; cfi++) {
              addedKingBlocks.push(letters[cfi] + tss2);
            }
          }else {                                                                 // if threat line is diagonal

            if (tss2 == smallNmb.toString() && letters.indexOf(tss1) < letters.indexOf(tks1)) {
              ltrIncreasing = true;
            }else if (tss2 == smallNmb.toString() && letters.indexOf(tss1) > letters.indexOf(tks1)){
              ltrIncreasing = false;
            }else if (tks2 == smallNmb.toString() && letters.indexOf(tks1) < letters.indexOf(tss1)) {
              ltrIncreasing = true;
            }else if (tks2 == smallNmb.toString() && letters.indexOf(tks1) > letters.indexOf(tss1)){
              ltrIncreasing = false;
            }

            var baseIndex = letters.indexOf(smallLtr), highIndex = letters.indexOf(bigLtr), tmpNmnm = parseInt(tks2), tmpLtnm = letters.indexOf(tks1), tmpNmnm2 = parseInt(tks2), tmpLtnm2 = letters.indexOf(tks1);

            for (var gi = bigNmb; gi >= smallNmb; gi--) {
              if (ltrIncreasing) {
                threatLine.push(letters[highIndex] + gi.toString());
                highIndex--;
                for (var cfi = 0; cfi < 8; cfi++) {
                  if (document.getElementById(letters[tmpLtnm] + tmpNmnm.toString())) {addedKingBlocks.push(letters[tmpLtnm] + tmpNmnm.toString());}
                  tmpNmnm++; tmpLtnm++;
                  if (document.getElementById(letters[tmpLtnm2] + tmpNmnm2.toString())) {addedKingBlocks.push(letters[tmpLtnm2] + tmpNmnm2.toString());}
                  tmpNmnm2--; tmpLtnm2--;
                }
              }else{
                threatLine.push(letters[baseIndex] + gi.toString());
                baseIndex++;
                for (var cfi = 0; cfi < 8; cfi++) {
                  if (document.getElementById(letters[tmpLtnm] + tmpNmnm.toString())) {addedKingBlocks.push(letters[tmpLtnm] + tmpNmnm.toString());}
                  tmpNmnm++; tmpLtnm--;
                  if (document.getElementById(letters[tmpLtnm2] + tmpNmnm2.toString())) {addedKingBlocks.push(letters[tmpLtnm2] + tmpNmnm2.toString());}
                  tmpNmnm2--; tmpLtnm2++;
                }
              }
            }
          }
        }else {
          threatLine.push(threatSq[0]);                                         // if the threat is a knight
        }


        for (var gdri = 0; gdri < squares.length; gdri++) {
          if ((threatLine.includes(squares[gdri].getAttribute("data-name")) == false) && (elmnt.id != "whiteKing" && elmnt.id != "blackKing")) {    //block every square except threatLine
            squares[gdri].querySelector(".circle").classList.remove("showCircle");
          }
        }



        if (elmnt.getAttribute("data-piece") == "5") {                          // King's ability to attack near opponent which is not protected

          for (var krs = 0; krs < squares.length; krs++) {
            if (addedKingBlocks.includes(squares[krs].getAttribute("data-name"))) {      // blocking the threaded line
              squares[krs].querySelector(".circle").classList.remove("showCircle");
            }
          }

          for (var yti = 0; yti < ary2.length; yti++) {                           // unblocking king environment if it's propriate
            var tmpSq21 = document.getElementById(ary2[yti]);
            if ((tmpSq21) && (tmpSq21.classList.contains("full")) && (tmpSq21.querySelector("img").getAttribute("data-color") != turn) && (wideAry2.includes(ary2[yti]) == false) && (ary1.includes(ary2[yti]) == false)) {
              tmpSq21.querySelector(".circle").classList.add("showCircle");
            }
          }

          for (var krs = 0; krs < squares.length; krs++) {
            if (addedKingBlocks.includes(squares[krs].getAttribute("data-name"))) {     // blocking the threaded line again
              squares[krs].querySelector(".circle").classList.remove("showCircle");
            }
          }

          if (ary2.includes(xxx) && wideAry2.includes(xxx) == false && ary1.includes(xxx) == false) {
            document.getElementById(xxx).querySelector(".circle").classList.add("showCircle");    // unblocking threat square if it is unprotected
          }
        }

        if (doublecheck) {

          if (elmnt.getAttribute("data-piece") != "5") {
            for (var mfi = 0; mfi < squares.length; mfi++) {
              squares[mfi].querySelector(".circle").classList.remove("showCircle");
            }
          }
        }

      }

      if (checkControl) {
        checkControlFnc(threatSq[0]);
      }else if (doublecheck){
        checkControlFnc(threatSq[0]);
        checkControlFnc(threatSq[1]);
      }




      if (oncnt) {
        for (var cri = 0; cri < squares.length; cri++) {
          if(squares[cri].querySelector(".circle").classList.contains("showCircle")){
            counter++;
          }
        }
        for (var lsi = 0; lsi < squares.length; lsi++) {
          squares[lsi].querySelector(".circle").classList.remove("showCircle");
        }
      }


    }







function appendPiece(elm,event){

  if ((firstSq == event.target) || (firstSq == event.target.parentElement)) {
    // no turn changing, piece left on same square
  }
  else if (event.target.classList.contains("full") && (event.target.querySelector("img")) && (elm.getAttribute("data-color") != event.target.querySelector("img").getAttribute("data-color")) && (event.target.querySelector(".circle").classList.contains("showCircle"))) {
                                                      // if target is full and propriate square and has opponent piece
    var diePiece = event.target.querySelector("img");
    takePiece(diePiece);
    firstSq.classList.remove("full");                                           // old square is unclassNamed ('full')
    event.target.appendChild(elm);                                              // if the target is a propriate square then append the piece
    elm.parentElement.classList.add("full");                                    // new square is classNamed ('full')
    var nSq = elm.parentElement;
    checkControl = false;
    doublecheck = false;
    isPawnPromotion(elm);
    if(pawnPrmCnt){
      tmpPrev = firstSq;
      pawnPrmCnt = false;
    }else{
      otherRules(elm,firstSq);
      changeTurn();
    }

  }else if (event.target.classList.contains("square") && (event.target.classList.contains("full") == false) && (event.target.querySelector(".circle").classList.contains("showCircle"))) {
                                                      // if target is an empty and propriate square
    firstSq.classList.remove("full");                                           // old square is unclassNamed ('full')
    event.target.appendChild(elm);                                              // if the target is a propriate square then append the piece
    elm.parentElement.classList.add("full");                                    // new square is classNamed ('full')
    var nSq = elm.parentElement;
    checkControl = false;
    doublecheck = false;
    isPawnPromotion(elm);
    enpassant(elm,firstSq);   //enpassant rule
    if(pawnPrmCnt){
      tmpPrev = firstSq;
      pawnPrmCnt = false;
    }else{
      otherRules(elm,firstSq);
      changeTurn();
    }


  }else if ((event.target.parentElement) && (event.target.parentElement.classList.contains("square")) && (elm.getAttribute("data-color") != event.target.getAttribute("data-color")) && (event.target.parentElement.querySelector(".circle").classList.contains("showCircle"))) {
                                                      // if target is the opponent piece in propriate square
    var nSq = event.target.parentElement, diePiece = event.target;
    takePiece(diePiece);
    firstSq.classList.remove("full");                                           // old square is unclassNamed ('full')
    nSq.appendChild(elm);                                                       // if the target is a propriate square then append the piece
    nSq.classList.add("full");                                                  // new square is classNamed ('full')
    checkControl = false;
    doublecheck = false;
    isPawnPromotion(elm);
    if(pawnPrmCnt){
      tmpPrev = firstSq;
      pawnPrmCnt = false;
    }else{
      otherRules(elm,firstSq);
      changeTurn();
    }

  }

  elm.style.left = "0";
  elm.style.top = "0";
}




function changeTurn(){
  if (turn == "white") {
    turn = "black";
  }else {                                                                       // turn changer function
    turn = "white";
  }
  var tmpKng = enmKing;
  enmKing = myKing;       //updating enemy and ally Kings
  myKing = tmpKng;
  envrOfKing(enmKing,envOfKing);
  envrOfKing(myKing,envOfInTurnKing);   // setting both kings' environment squares
  isGameOver();
  if (timer) {
    if (addingSec) {
      turn == "white" ? addSec(wMin, wSec) : addSec(bMin, bSec);
    }
    clearInterval(clock);
    turn == "white" ? startClock(turn, wMin, wSec) : startClock(turn, bMin, bSec);
  }
}


var timer = false;
var isAdding = false;
var addingSec = 0;
var bTime = document.querySelector(".bTime");
var wTime = document.querySelector(".wTime");


var counter = 0, oncnt = false;
function isGameOver(){
  counter = 0;
  oncnt = true;

  for (var rwi = 0; rwi < imgs.length; rwi++) {
    if(imgs[rwi] && imgs[rwi].getAttribute("data-color") == turn){
      dragPiece(imgs[rwi]);
    }
  }
  counter = 0;
  for (var rwi = 0; rwi < imgs.length; rwi++) {
    if(imgs[rwi] && imgs[rwi].getAttribute("data-color") == turn){
      dragPiece(imgs[rwi]);
    }
  }


  if (counter == 0 && (checkControl || doublecheck)) {
    turn == "white" ? gameOver("black") : gameOver("white");
  }else if (counter == 0 && checkControl == false && doublecheck == false) {
    gameOver("draw");
  }

    oncnt = false;

}




function envrOfKing(x,z){
  z = [];
  var ltrOfEnmKng = letters9.indexOf(x.parentElement.getAttribute("data-name").substr(0,1));
  var nmbOfEnmKng = parseInt(x.parentElement.getAttribute("data-name").substr(1,1));

  z.push(letters9[ltrOfEnmKng-1] + (nmbOfEnmKng+1).toString());
  z.push(letters9[ltrOfEnmKng-1] + nmbOfEnmKng.toString());
  z.push(letters9[ltrOfEnmKng-1] + (nmbOfEnmKng-1).toString());
  z.push(letters9[ltrOfEnmKng] + (nmbOfEnmKng+1).toString());
  z.push(letters9[ltrOfEnmKng] + (nmbOfEnmKng-1).toString());
  z.push(letters9[ltrOfEnmKng+1] + (nmbOfEnmKng+1).toString());
  z.push(letters9[ltrOfEnmKng+1] + nmbOfEnmKng.toString());
  z.push(letters9[ltrOfEnmKng+1] + (nmbOfEnmKng-1).toString());

  x == myKing ? ary2 = z : ary1 = z;
}

var ary1 = [], ary2 = [];



// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------


  function otherRules(element, oldSq){

    var pNum = element.getAttribute("data-piece");
    var newSquare = element.parentElement;
    var elmID = element.id;



    for (var i = 0; i < squares.length; i++) {
      if (squares[i].querySelector("img") && squares[i].querySelector("img").getAttribute("data-fm") == "false") {  // turning every played pawn ok, so it can not be taken from diagonal
        squares[i].querySelector("img").setAttribute("data-fm","ok");
      }
    }

    if ((pNum == "6" || pNum == "7") && (element.getAttribute("data-fm") == "true") && (element.parentElement.getAttribute("data-name").substr(1,1) == "4" || element.parentElement.getAttribute("data-name").substr(1,1) == "5")) {
      element.setAttribute("data-fm","false");                                                     // setting the first move was played or not
    }


    // ------------ //

    var counterCC = 0;
    threatSq = []; thrtdKng = "";
    for (var vdi = 0; vdi < squares.length; vdi++) {
      if (squares[vdi].querySelector("img") && squares[vdi].querySelector("img").getAttribute("data-color") == turn) {
        findNewSquares(squares[vdi].querySelector("img").getAttribute("data-piece"),squares[vdi]);
        if (check == true) {
          counterCC++;
          threatSq.push(squares[vdi].getAttribute("data-name"));
        }
      }
      check = false;                                                                                                      // "check" controls, is it check or not or double check?
    }

    if (counterCC == 1){ checkControl = true; }
    else if (counterCC == 2){ doublecheck = true;}


    // ------------ //


    lvzz = true;
    wideAry = [];
    for (var rsi = 0; rsi < squares.length; rsi++) {
      if (squares[rsi].querySelector("img") && squares[rsi].querySelector("img").getAttribute("data-color") == turn) {
        var tmPc = squares[rsi].querySelector("img");                                                                   // king movements under check
        findNewSquares(tmPc.getAttribute("data-piece"),squares[rsi]);
        var zzzAry = [leftAry, rightAry, topAry, bottomAry, ltDiagAry, lbDiagAry, rtDiagAry, rbDiagAry, knightAry, wPawnAry, bPawnAry];
        for (var tti = 0; tti < zzzAry.length; tti++) {
          for (var tdi = 0; tdi < zzzAry[tti].length; tdi++) {
            if (zzzAry[tti][tdi] != null) {
              wideAry.push(zzzAry[tti][tdi]);
            }
          }
        }
      }
    }
    lvzz = false;


    // ------------ //


    if (elmID == "leftRookBlack" || elmID == "blackKing" || elmID == "rightRookBlack" || elmID == "leftRookWhite" || elmID == "whiteKing" || elmID == "rightRookWhite") {
      document.getElementById(elmID).setAttribute("data-moved",true);
    }

    if (pNum == "5" && oldSq.getAttribute("data-name") == "e1" && newSquare.getAttribute("data-name") == "g1") {
      f1.appendChild(wrRook); f1.classList.add("full"); h1.classList.remove("full"); wrRook.setAttribute("data-moved",true);
    }else if (pNum == "5" && oldSq.getAttribute("data-name") == "e1" && newSquare.getAttribute("data-name") == "c1") {
      d1.appendChild(wlRook); d1.classList.add("full"); a1.classList.remove("full"); wlRook.setAttribute("data-moved",true);
    }else if (pNum == "5" && oldSq.getAttribute("data-name") == "e8" && newSquare.getAttribute("data-name") == "g8") {
      f8.appendChild(brRook); f8.classList.add("full"); h8.classList.remove("full"); brRook.setAttribute("data-moved",true);
    }else if (pNum == "5" && oldSq.getAttribute("data-name") == "e8" && newSquare.getAttribute("data-name") == "c8") {
      d8.appendChild(blRook); d8.classList.add("full"); a8.classList.remove("full"); blRook.setAttribute("data-moved",true);
    }


    // ------------ //


  }

  var lvzz = false;




  var check = false, doublecheck = false, checkControl = false, threatSq = [], thrtdKng = "", wideAry = [];
  var leftAry = [], rightAry = [], topAry = [], bottomAry = [], ltDiagAry = [], lbDiagAry = [], rtDiagAry = [], rbDiagAry = [], knightAry = [], wPawnAry = [], bPawnAry = [];


 function findNewSquares(elmNum,nws){                                             // finding the prop squares of new square's element
   var sqLetter2 = nws.getAttribute("data-name").substr(0,1);
   var sqNumber2 = nws.getAttribute("data-name").substr(1,1);
   var letters = ["a", "b", "c", "d", "e", "f","g","h"];
   var letterLine2 = letters.indexOf(sqLetter2);
   leftAry = [], rightAry = [], topAry = [], bottomAry = [], ltDiagAry = [], lbDiagAry = [], rtDiagAry = [], rbDiagAry = [], knightAry = [], wPawnAry = [], bPawnAry = [];
   var tmpNumberfns = parseInt(sqNumber2);
   var aryyy;


   if (elmNum == "1" || elmNum == "4") {
     for (var ri = parseInt(sqNumber2)+1; ri < 9; ri++) {
       var tmpft = document.getElementById(sqLetter2 + ri.toString());
       if (tmpft.querySelector("img")) {
         topAry.push(sqLetter2 + ri.toString());
         break;
       }else {
         topAry.push(sqLetter2 + ri.toString());
       }
     }
     for (var ri = parseInt(sqNumber2)-1; ri > 0; ri--) {
       var tmpft = document.getElementById(sqLetter2 + ri.toString());
       if (tmpft.querySelector("img")) {
         bottomAry.push(sqLetter2 + ri.toString());
         break;
       }else {
         bottomAry.push(sqLetter2 + ri.toString());
       }
     }                                                                              // if it's rook or queen
     for (var ri = letterLine2+1; ri <= 7; ri++) {
       var tmpft = document.getElementById(letters[ri] + sqNumber2);
       if (tmpft.querySelector("img")) {
         rightAry.push(letters[ri] + sqNumber2);
         break;
       }else {
         rightAry.push(letters[ri] + sqNumber2);
       }
     }
     for (var ri = letterLine2-1; ri >= 0; ri--) {
       var tmpft = document.getElementById(letters[ri] + sqNumber2);
       if (tmpft.querySelector("img")) {
         leftAry.push(letters[ri] + sqNumber2);
         break;
       }else {
         leftAry.push(letters[ri] + sqNumber2);
       }
     }

     aryyy = [leftAry,rightAry,topAry,bottomAry];
     isCheck(aryyy);
   }


   var lastCnt = true;
   if (elmNum == "3" || elmNum == "4") {                                                  // if it's queen or bishop
     for (var ri = letterLine2-1; ri >= 0; ri--) {
       var tmpft = document.getElementById(letters[ri] + (tmpNumberfns+1).toString());
       if (tmpft && tmpft.querySelector("img")) {
         tmpNumberfns++;
         if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
           ltDiagAry.push(letters[ri] + tmpNumberfns.toString());
         }
         lastCnt = false;
         break;
       }else {
         if (lastCnt) {
           tmpNumberfns++;
           if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
             ltDiagAry.push(letters[ri] + tmpNumberfns.toString());
           }
         }
         if (letters[ri] == "a" || tmpNumberfns == 8) {lastCnt = false;}
       }

     }

     tmpNumberfns = parseInt(sqNumber2); lastCnt = true;

     for (var ri = letterLine2-1; ri >= 0; ri--) {
       var tmpft = document.getElementById(letters[ri] + (tmpNumberfns-1).toString());
       if (tmpft && tmpft.querySelector("img")) {
         tmpNumberfns--;
         if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
           lbDiagAry.push(letters[ri] + tmpNumberfns.toString());
         }
         lastCnt = false;
         break;
       }else {
         if (lastCnt) {
           tmpNumberfns--;
           if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
             lbDiagAry.push(letters[ri] + tmpNumberfns.toString());
           }
         }
         if (letters[ri] == "a" || tmpNumberfns == 1) {lastCnt = false;}
       }

     }

     tmpNumberfns = parseInt(sqNumber2); lastCnt = true;

     for (var ri = letterLine2+1; ri <= 7; ri++) {
       var tmpft = document.getElementById(letters[ri] + (tmpNumberfns-1).toString());
       if (tmpft && tmpft.querySelector("img")) {
         tmpNumberfns--;
         if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
           rbDiagAry.push(letters[ri] + tmpNumberfns.toString());
         }
         lastCnt = false;
         break;
       }else {
         if (lastCnt) {
           tmpNumberfns--;
           if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
             rbDiagAry.push(letters[ri] + tmpNumberfns.toString());
           }
         }
         if (letters[ri] == "h" || tmpNumberfns == 1) {lastCnt = false;}
       }

     }

     tmpNumberfns = parseInt(sqNumber2); lastCnt = true;

     for (var ri = letterLine2+1; ri <= 7; ri++) {
       var tmpft = document.getElementById(letters[ri] + (tmpNumberfns+1).toString());
       if (tmpft && tmpft.querySelector("img")) {
         tmpNumberfns++;
         if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
           rtDiagAry.push(letters[ri] + tmpNumberfns.toString());
         }
         lastCnt = false;
         break;
       }else {
         if (lastCnt) {
           tmpNumberfns++;
           if (document.getElementById(letters[ri] + tmpNumberfns.toString()) != null) {
             rtDiagAry.push(letters[ri] + tmpNumberfns.toString());
           }
         }
         if (letters[ri] == "h" || tmpNumberfns == 8) {lastCnt = false;}
       }
     }

     aryyy = [ltDiagAry,lbDiagAry,rtDiagAry,rbDiagAry];
     isCheck(aryyy);
   }


   if (elmNum == "2") {
     var tkm, aryforkn = ["+1","-1","+1","-1","-2","-2","+2","+2"], aryforkn2 = ["+2","+2","-2","-2","+1","-1","+1","-1"];
     for (var kni = 0; kni < aryforkn.length; kni++) {
       tkm = letters[letterLine2 + parseInt(aryforkn[kni])] + ((parseInt(sqNumber2) + parseInt(aryforkn2[kni])).toString());    // Knight prop movements
       if (document.getElementById(tkm)) {
         knightAry.push(tkm);
       }
     }
     aryyy = [knightAry];
     isCheck(aryyy);
   }



   if (elmNum == "6") {
     var wpmvs = letters[letterLine2 - 1] + (parseInt(sqNumber2)+1).toString();
     if (document.getElementById(wpmvs)) {wPawnAry.push(wpmvs);}
     wpmvs = letters[letterLine2 + 1] + (parseInt(sqNumber2)+1).toString();                         // pawn's prop movements
     if (document.getElementById(wpmvs)) {wPawnAry.push(wpmvs);}
     aryyy = [wPawnAry];
     isCheck(aryyy);
   }

   if (elmNum == "7") {
     var wpmvs = letters[letterLine2 - 1] + (parseInt(sqNumber2)-1).toString();
     if (document.getElementById(wpmvs)) {bPawnAry.push(wpmvs);}                                    // pawn's prop movements
     wpmvs = letters[letterLine2 + 1] + (parseInt(sqNumber2)-1).toString();
     if (document.getElementById(wpmvs)) {bPawnAry.push(wpmvs);}
     aryyy = [bPawnAry];
     isCheck(aryyy);
   }



   function isCheck(ary) {                                                      // checking whether is it "checked" or not
     for (var fi = 0; fi < ary.length; fi++) {
       for (var fi2 = 0; fi2 < ary[fi].length; fi2++) {
         var pelm = document.getElementById(ary[fi][fi2]);
         if (pelm && pelm.querySelector("img") && pelm.querySelector("img").getAttribute("data-piece") == "5" && pelm.querySelector("img").getAttribute("data-color") != turn) {
           if (lvzz == false) {
             check = true;
             thrtdKng = pelm.getAttribute("data-name");
           }
         }
       }
     }
   }
 }





function enpassant(elm,fsq){
  var pNum2 = elm.getAttribute("data-piece");
  var newSquare2 = elm.parentElement;
  var firstSq2 = fsq;
  var controlPwnSq = document.getElementById(newSquare2.getAttribute("data-name").substr(0,1) + (parseInt(newSquare2.getAttribute("data-name").substr(1,1)) - 1).toString());
  var controlPwnSq2 = document.getElementById(newSquare2.getAttribute("data-name").substr(0,1) + (parseInt(newSquare2.getAttribute("data-name").substr(1,1)) + 1).toString());

  if ((pNum2 == "6") && (newSquare2.getAttribute("data-name").substr(0,1) != firstSq2.getAttribute("data-name").substr(0,1)) && (controlPwnSq) && (controlPwnSq.querySelector("img")) && (controlPwnSq.querySelector("img").getAttribute("data-fm") == "false")) {
    takePiece(controlPwnSq.querySelector("img"));
    controlPwnSq.classList.remove("full");
  }else if ((pNum2 == "7") && (newSquare2.getAttribute("data-name").substr(0,1) != firstSq2.getAttribute("data-name").substr(0,1)) && (controlPwnSq2) && (controlPwnSq2.querySelector("img")) && (controlPwnSq2.querySelector("img").getAttribute("data-fm") == "false")) {
    takePiece(controlPwnSq2.querySelector("img"));
    controlPwnSq2.classList.remove("full");
  }
}


var blackPoint = 0, whitePoint = 0;
var wAnm = document.querySelector(".whiteAmmunition");
var bAnm = document.querySelector(".blackAmmunition");

function takePiece(piece5){
  var pnumber = piece5.getAttribute("data-piece");
  var pColor = piece5.getAttribute("data-color");
  var wAdv = wAnm.querySelector(".advantage");
  var bAdv = bAnm.querySelector(".advantage");
  var tmpPoint = 0, tmpClass = "";

  if (pnumber == "6" || pnumber == "7") {
    tmpClass = "pawn"; tmpPoint = 1;
  }else if (pnumber == "4") {
    tmpClass = "queen"; tmpPoint = 9;
  }else if (pnumber == "3") {
    tmpClass = "bishop"; tmpPoint = 3;
  }else if (pnumber == "2") {
    tmpClass = "knight"; tmpPoint = 3;
  }else if (pnumber == "1") {
    tmpClass = "rook"; tmpPoint = 5;
    piece5.setAttribute("data-moved", true);                                    // for displaying which pieces was taken and to be propriate we created this function
  }

  var newIcon = document.createElement("i");
  newIcon.className = "fa-solid fa-chess-" + tmpClass;

 if (pColor == "black") {
   wAnm.insertBefore(newIcon,wAnm.querySelector(".advantage"));
   whitePoint += tmpPoint;
 }else {
   bAnm.insertBefore(newIcon,bAnm.querySelector(".advantage"));
   blackPoint += tmpPoint;
 }

 if (whitePoint>blackPoint) {
   var diff = whitePoint - blackPoint;
   bAdv.innerText = "";
   wAdv.innerText = "+" + diff;
 }else if (whitePoint<blackPoint) {
   var diff = blackPoint - whitePoint;
   wAdv.innerText = "";
   bAdv.innerText = "+" + diff;
 }else {
   bAdv.innerText = "";
   wAdv.innerText = "";
 }


  piece5.remove();
}



var pawnPrmCnt = false, tmpPrev;

function isPawnPromotion(elm){                                                  // pawn promotion rule control
  var nsq91 = elm.parentElement;
  var elmnNum = elm.getAttribute("data-piece");
  var tmpBox;

  if ((elmnNum == "6" || elmnNum == "7") && (nsq91.getAttribute("data-name").substr(1,1) == "1" || nsq91.getAttribute("data-name").substr(1,1) == "8")) {
    if (elmnNum == "6") {
      tmpBox = document.querySelector(".whiteNPB");
      tmpBox.classList.add("showBox");

    }else{
      tmpBox = document.querySelector(".blackNPB");
      tmpBox.classList.add("showBox");
    }
    nsq91.appendChild(tmpBox);
    newPieceSquare = nsq91.getAttribute("data-name");
    pawnPrmCnt = true;

    for (var zi = 0; zi < imgs.length; zi++) {imgs[zi].style.pointerEvents = "none";}  // disable clicking when promotion div poped up
  }
}



var imgs = document.getElementsByTagName("img");
var newPieces = document.querySelectorAll(".npbpc");
var newPieceSquare = "";
var newPiecesAry = [
  ['1','rook','white'],['2','knight','white'],['3','bishop','white'],['4','queen','white'],['1','rook-black','black'],['2','knight-black','black'],['3','bishop-black','black'],['4','queen-black','black'],
];

for (var vdi = 0; vdi < newPieces.length; vdi++) {                              // when pawn promoting div is poped up, this is the buttons' onclick function
  newPieces[vdi].onclick = function(){
    var elm87 = newPiecesAry[parseInt(this.getAttribute("data-pn"))];
    var newPcSq = document.getElementById(newPieceSquare);

    var newPc = document.createElement("img");
    newPc.width = 60; newPc.height = 60;
    newPc.setAttribute("data-piece",elm87[0]);
    newPc.setAttribute("data-color",elm87[2]);                                  // creating new piece as a node
    newPc.src = "doc/" + elm87[1] + ".png";

    newPcSq.querySelector("img").remove();
    newPcSq.appendChild(newPc); newPcSq                                         // appending it and giving the drag ability
    dragElement(newPc);

    this.parentElement.classList.remove("showBox");
    otherRules(newPc,tmpPrev);
    changeTurn();
    for (var zi = 0; zi < imgs.length; zi++) {imgs[zi].style.pointerEvents = "auto";}
    for (var zpi = 0; zpi < squares.length; zpi++) {squares[zpi].querySelector(".circle").classList.remove("showCircle");}
  }
}




var bMin = 2, wMin = 2, bSec = 60, wSec = 60, clock;

function startClock(turnn, min, sec){
var span, clockIcon, minText = "", secText = "";

  if (turnn == "white") {
    span = document.querySelector(".whiteClock").querySelector("#time");
  }else {
    span = document.querySelector(".blackClock").querySelector("#time");
  }

  clockIcon = span.parentElement.querySelector(".clock");

  function turnClockAnm(){                                                                // finding which avatars and time was selected
    if(clockIcon.classList.contains("twelve")){
        clockIcon.classList.remove("twelve"); clockIcon.classList.add("fifteen");
    }else if(clockIcon.classList.contains("fifteen")){
        clockIcon.classList.remove("fifteen"); clockIcon.classList.add("thirty");
    }else if(clockIcon.classList.contains("thirty")){
        clockIcon.classList.remove("thirty"); clockIcon.classList.add("fourty-five");
    }else if(clockIcon.classList.contains("fourty-five")){
        clockIcon.classList.remove("fourty-five"); clockIcon.classList.add("twelve");
    }
  }



    clock = setInterval(function(){
    sec--;                turnn == "white" ? wSec-- : bSec--;
    if (sec == 0) {
      sec = 60;           turnn == "white" ? wSec=60 : bSec=60;
      secText = "00";
      minText = min;
      min--;              turnn == "white" ? wMin-- : bMin--;
    }else if (sec<10) {                                                         // clock stuff, when the time run out the game is over
      secText = "0" + sec;
      minText = min;
    }else if(sec>9) {
      secText = sec;
      minText = min;
    }

    turnClockAnm();
    span.innerText = minText + ":" + secText;


    if (minText == "-1" && secText == "59") {
      if (turnn == "white") {
        gameOver("black");
      }else {
        gameOver("white");
      }
    }

  },1000);

}




function addSec(min, sec){

  if (turn == "white") {
    bSec += addingSec;
    sec = bSec;
  }else {
    wSec += addingSec;
    sec = wSec;
  }

  if (sec > 60) {                                                                               // added timing mode function when turn changed
    sec = sec - 60;   turn == "white" ? bSec -= 60 : wSec -= 60;
    min++;            turn == "white" ? bMin++ : wMin++;
    turn == "black" ? wTime.innerText = wMin + ":0" + wSec : bTime.innerText = bMin + ":0" + bSec;
  }else if (sec < 60){
    var dvider = "";
    sec < 10 ? dvider = ":0" : dvider = ":";
    turn == "black" ? wTime.innerText = wMin + dvider + wSec : bTime.innerText = bMin + dvider + bSec;
  }else if(sec == 60){
    turn == "black" ? wTime.innerText = (wMin + 1) + ":00" : bTime.innerText = (bMin + 1) + ":00";
  }
}





// ------------------------------------------------------------
// ------------------------------------------------------------


var settings = document.querySelector(".settings");
var whiteIcons = document.getElementById("whiteIconSlc").querySelectorAll("i");
var blackIcons = document.getElementById("blackIconSlc").querySelectorAll("i");
var clocks = document.getElementById("clockFS").querySelectorAll("span");
var startBtn = document.getElementById("start");

  for (var tfi = 0; tfi < whiteIcons.length; tfi++) {
    whiteIcons[tfi].onclick = function(){for (var tfi2 = 0; tfi2 < whiteIcons.length; tfi2++){whiteIcons[tfi2].classList.remove("chosenIcon");} this.classList.add("chosenIcon");}
    blackIcons[tfi].onclick = function(){for (var tfi2 = 0; tfi2 < blackIcons.length; tfi2++){blackIcons[tfi2].classList.remove("chosenIcon");} this.classList.add("chosenIcon");}
    clocks[tfi] ? clocks[tfi].onclick = function(){for (var tfi2 = 0; tfi2 < clocks.length; tfi2++){clocks[tfi2].classList.remove("chosenTime");} this.classList.add("chosenTime");} : null;
  }


  startBtn.onclick = function(){
    settings.classList.remove("show");
    wrap.classList.add("show");

    var chosenWhiteIcon = document.getElementById("whiteIconSlc").querySelector(".chosenIcon");
    var chosenBlackIcon = document.getElementById("blackIconSlc").querySelector(".chosenIcon");

    wAnm.querySelector("i").className = chosenWhiteIcon.className + " avatar"; wAnm.querySelector("i").classList.remove("chosenIcon");
    bAnm.querySelector("i").className = chosenBlackIcon.className + " avatar"; bAnm.querySelector("i").classList.remove("chosenIcon");

    var clockFs = document.getElementById("clockFS");
    var chosenTime = document.querySelector(".chosenTime");
    if (chosenTime == clockFS.children[1]) {
      timer = false;
      document.querySelector(".blackClock").remove();
      document.querySelector(".whiteClock").remove();
    }else if (chosenTime == clockFS.children[2]) {
      timer = true;
      addingSec = 0;                                                            // setting startup and starting game
      bMin = 0; wMin = 0;
      wTime.innerText = "1:00";
      bTime.innerText = "1:00";
      startClock("white", wMin, wSec);
    }else if (chosenTime == clockFS.children[3]) {
      timer = true;
      isAdding = true;
      addingSec = 2;
      bMin = 2; wMin = 2;
      wTime.innerText = "3:00";
      bTime.innerText = "3:00";
      startClock("white", wMin, wSec);
    }else{
      timer = true;
      isAdding = true;
      addingSec = 3;
      bMin = 4; wMin = 4;
      wTime.innerText = "5:00";
      bTime.innerText = "5:00";
      startClock("white", wMin, wSec);
    }
  }




// ------------------------------------------------------------
// ------------------------------------------------------------

var resultSpan = document.getElementById("result");
var goCnt = document.querySelector(".goContainer");
var winnerIcon = document.querySelector(".winner");

function gameOver(winner) {
  goCnt.style.transform = "scale(1)";
  clearInterval(clock);

  if (winner == "black") {
    resultSpan.innerText = "BLACK WON";
    winnerIcon.className = bAnm.querySelector(".avatar").className + " winner";
    wTime.innerText == "-1:59" ? wTime.innerText = "0:00" : null;                             // Game Over function
  }else if (winner == "white"){
    resultSpan.innerText = "WHITE WON";
    winnerIcon.className = wAnm.querySelector(".avatar").className + " winner";
    bTime.innerText == "-1:59" ? bTime.innerText = "0:00" : null;
  }else {
    resultSpan.innerText = "DRAW";
    winnerIcon.className = "";
  }
}
