var height = 10;
var string = '';

for (var i = 0; i < height; i++) {
    for (var x = 0; x < i; x++) {
        string += '*';
    }
    string += '\n';
}
console.log(string);