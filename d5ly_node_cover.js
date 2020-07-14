var pako = require('pako')
const zlib = require('zlib');

var factory = require('./d5ly_node.js');
d5ly = factory()

function getInt32(uint8Pointer){
	return d5ly.HEAPU32[Math.ceil(uint8Pointer/4)]
}

function passArrayToWasm(array, size) {
    const ptr = d5ly._malloc(size);
	if(!ptr) throw "Memory Error"
	d5ly.HEAPU8.set(array, ptr);
	return ptr;
}
function getArrayFromWasm(ptr, len) {
	return d5ly.HEAPU8.subarray(ptr, ptr + len);
}

function d5ly_compress(sourceArray)
{
  	var len = sourceArray.length;
	var sourcePointer = passArrayToWasm(sourceArray, len * 2);
	var compressedSize = d5ly._compress(sourcePointer, len);
	var compressedArray = getArrayFromWasm(sourcePointer+len, compressedSize).slice();
	d5ly._free(sourcePointer)
	return compressedArray;
}

function d5ly_decompress(compressedArray) {
  	var len = compressedArray.length;
	var compressedArrayPointer = passArrayToWasm(compressedArray, len + 7);
	var decompressedSize = d5ly._decompress(compressedArrayPointer, len);
	decompressedArrayPointer = getInt32(compressedArrayPointer + len)
	console.log(decompressedSize)
	console.log(decompressedArrayPointer)
	var decompressedArray = getArrayFromWasm(decompressedArrayPointer, decompressedSize).slice();
	d5ly._free(compressedArrayPointer)
	d5ly._free(decompressedArrayPointer)
	return decompressedArray;
}

///////////////////////////////////////
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function getSourceArray(){
	var sourceArray = new Uint8Array(1000000000);
	for (var i = 0; i < sourceArray.length; i++)
	sourceArray[i] = 0;
	// sourceArray[i] = getRandomInt(100) + (255 - 100)/2;
	return sourceArray
}

function check_equality(sourceArray, decompressedArray){
	error = 0
	for (var i = 0; i < sourceArray.length; i++)
	if( sourceArray[i] != decompressedArray[i]) 
	{
		console.log("ERROR_DECOMPRESS: " + i)
		error = 1
		break
	}
	if(!error) console.log("EQUAL")
}


function battle_with_pako(){
	var sourceArray = getSourceArray()
	
	console.time('pako')
	compr = pako.deflateRaw(sourceArray)
	console.timeEnd('pako')
	console.log('size: ' + compr.length)

	console.time('d5ly_compress')
	compressedArray = d5ly_compress(sourceArray)
	console.timeEnd('d5ly_compress')
	console.log('size: ' + compressedArray.length)

	console.time('nodejs_zlib')
	compr2 = zlib.deflateRawSync(sourceArray)
	console.timeEnd('nodejs_zlib')
	console.log('size: ' + compr2.length)

	decompressedArray = d5ly_decompress(compr2)
	check_equality(sourceArray, decompressedArray)
}

d5ly['onRuntimeInitialized'] = function() {
	battle_with_pako()
}

