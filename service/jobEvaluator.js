//sorting 2-D array with multiple column
function jobEvaluatorSort(data) {
    const dataConcat = data.map(d => {
        d[2] = d[2].replace('$', '')
        d[2] = d[2].replace('.', '')
        
        //to normalize the length
        if (d[2].length != 4) {
            d[2] = "0" + d[2]
        }
        if (d[3].length != 3) {
            d[3] = "0" + d[3]
        }
        
        let concat = d[0] + "" + d[1] + "" + d[2] + "" + d[3]
        return concat
    })

    let len = dataConcat.length;
    let indices = new Array(len);
    for (let i = 0; i < len; ++i) indices[i] = i;
    indices.sort(function (a, b) {
        return parseInt(dataConcat[a]) > parseInt(dataConcat[b]) ? -1 : parseInt(dataConcat[a]) < parseInt(dataConcat[b]) ? 1 : 0;
    });
    return indices
}

module.exports.evaluator = jobEvaluatorSort;