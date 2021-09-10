var table = '';

for (var x = 1; x < 11; x++) {
    for (var z = 1; z < 11; z++) {
        table += (z * x) + " ";
    }
    table += '\n';
}
console.log(table);