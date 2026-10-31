(()=>{
	const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	const positions=['Top left','Top middle','Top right','Middle left','Center','Middle right','Bottom left','Bottom middle','Bottom right'];
	const cells=[...document.querySelectorAll('.cell')],statusText=document.getElementById('status-text'),statusDot=document.getElementById('status-dot');
	const scores={X:0,O:0,draw:0};let board=Array(9).fill(''),turn='X',finished=false,computerMode=false,round=1;
	function updateScores(winner=''){
		document.getElementById('score-x').textContent=scores.X;document.getElementById('score-o').textContent=scores.O;document.getElementById('score-draw').textContent=scores.draw;
		document.getElementById('score-card-x').classList.toggle('active',!finished&&turn==='X');document.getElementById('score-card-o').classList.toggle('active',!finished&&turn==='O');
		if(winner)document.getElementById(`score-card-${winner.toLowerCase()}`).classList.add('active');
	}
	function setStatus(message,marker=turn){statusText.textContent=message;statusDot.className='status-dot'+(marker==='O'?' o':marker==='draw'?' draw':'')}
	function render(){
		cells.forEach((cell,i)=>{const mark=board[i];cell.textContent=mark==='X'?'×':mark==='O'?'○':'';cell.className='cell'+(mark?' '+mark.toLowerCase():'');cell.disabled=Boolean(mark)||finished||(computerMode&&turn==='O');cell.setAttribute('aria-label',`${positions[i]}, ${mark||'empty'}`)});
		document.getElementById('round-label').textContent=`ROUND ${round}`;updateScores();
	}
	function winnerFor(state){for(const line of wins)if(state[line[0]]&&state[line[0]]===state[line[1]]&&state[line[1]]===state[line[2]])return{player:state[line[0]],line};return null}
	function finishRound(result){
		finished=true;
		if(result){scores[result.player]++;result.line.forEach(i=>cells[i].classList.add('winner'));setStatus(`${computerMode&&result.player==='O'?'Computer':`Player ${result.player}`} wins!`,result.player)}
		else{scores.draw++;setStatus("It's a draw!",'draw')}
		render();if(result){result.line.forEach(i=>cells[i].classList.add('winner'));updateScores(result.player)}
	}
	function makeMove(index){
		if(finished||board[index]||(computerMode&&turn==='O'))return;
		board[index]=turn;const result=winnerFor(board);if(result)return finishRound(result);if(board.every(Boolean))return finishRound(null);
		turn=turn==='X'?'O':'X';setStatus(computerMode&&turn==='O'?'Computer is thinking…':`${turn}'s turn`,turn);render();if(computerMode&&turn==='O')window.setTimeout(computerMove,380);
	}
	function minimax(state,isMaximizing,depth=0){
		const result=winnerFor(state);if(result)return result.player==='O'?10-depth:depth-10;if(state.every(Boolean))return 0;
		let best=isMaximizing?-Infinity:Infinity;
		for(let i=0;i<9;i++){if(state[i])continue;state[i]=isMaximizing?'O':'X';const value=minimax(state,!isMaximizing,depth+1);state[i]='';best=isMaximizing?Math.max(best,value):Math.min(best,value)}
		return best;
	}
	function computerMove(){
		if(!computerMode||finished||turn!=='O')return;let bestScore=-Infinity,bestMoves=[];
		for(let i=0;i<9;i++){if(board[i])continue;board[i]='O';const score=minimax(board,false);board[i]='';if(score>bestScore){bestScore=score;bestMoves=[i]}else if(score===bestScore)bestMoves.push(i)}
		const move=bestMoves[Math.floor(Math.random()*bestMoves.length)];if(move!==undefined){board[move]='O';const result=winnerFor(board);if(result)return finishRound(result);if(board.every(Boolean))return finishRound(null);turn='X';setStatus('Your turn','X');render()}
	}
	function newRound(){board=Array(9).fill('');turn='X';finished=false;round++;setStatus(computerMode?'Your turn':"X's turn",'X');render();cells[0].focus()}
	function setMode(useComputer){computerMode=useComputer;document.getElementById('two-player-mode').setAttribute('aria-pressed',String(!useComputer));document.getElementById('computer-mode').setAttribute('aria-pressed',String(useComputer));document.getElementById('o-label').textContent=useComputer?'COMPUTER / O':'PLAYER 2 / O';document.getElementById('mode-hint').textContent=useComputer?'You are X · The computer plays O':'Take turns with a friend · X goes first';scores.X=scores.O=scores.draw=0;round=1;board=Array(9).fill('');turn='X';finished=false;setStatus(useComputer?'Your turn':"X's turn",'X');render()}
	cells.forEach(cell=>cell.addEventListener('click',()=>makeMove(Number(cell.dataset.index))));
	document.getElementById('two-player-mode').addEventListener('click',()=>setMode(false));document.getElementById('computer-mode').addEventListener('click',()=>setMode(true));document.getElementById('new-round').addEventListener('click',newRound);
	document.getElementById('reset-scores').addEventListener('click',()=>{scores.X=scores.O=scores.draw=0;round=1;board=Array(9).fill('');turn='X';finished=false;setStatus(computerMode?'Your turn':"X's turn",'X');render()});render();
})();
