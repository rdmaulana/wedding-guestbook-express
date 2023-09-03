function cetakProgram(n){
    for (let i=1; i <= n; i++) {
        let row = '';
        for (let j=1; j<=n; j++) {
            row += (i*j) + ' ';
        }
        console.log(row)
    }
}

cetakProgram(5);