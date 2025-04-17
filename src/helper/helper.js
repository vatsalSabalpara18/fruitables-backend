const pick = (object, keyArray) => {
    return keyArray.reduce((acc, value) => {
        if( object && object.hasOwnProperty(value) ){
            acc[value] = object[value]            
        }
        return acc;
    }, {})
}

module.exports = pick