
const reversedBoard = () => {
    const reversedBoard = [];
    let i = 100;

    while (i > 0) {
        const row = [];
        for (let j = 0; j < 10; j++) {
            if (reversedBoard.length % 2 === 0) {
                row.push(i);
                i--;
            } else {
                row.unshift(i);
                i--;
            }
        }
        reversedBoard.push(row);
    }
    return reversedBoard;
};

export { reversedBoard }