#include <stdlib.h>
#include <emscripten.h>
#include"core/lib/aligned_malloc.h"
#include "core/lib/libdeflate.h"

#define LVL 1

EMSCRIPTEN_KEEPALIVE
int compress(int source, int source_size)
{
    struct libdeflate_compressor* compressor = libdeflate_alloc_compressor(LVL);
    uint8_t* pointer = (uint8_t*)source;
    return libdeflate_deflate_compress(compressor, pointer, source_size, pointer+source_size, source_size);
}

uint8_t** decompress_pointer;
uint32_t buffer_size;
EMSCRIPTEN_KEEPALIVE
int decompress(int compressed, int compressed_size)
{
    struct libdeflate_decompressor* decompressor = libdeflate_alloc_decompressor();
    uint8_t* pointer = (uint8_t*)compressed;
    decompress_pointer = (uint8_t**)((int)((compressed + compressed_size + 3) / 4) * 4);
    buffer_size = compressed_size * 2;
    *decompress_pointer = (uint8_t*)malloc(buffer_size);
    size_t actual_size;
    libdeflate_deflate_decompress(decompressor, pointer, compressed_size, *decompress_pointer, buffer_size, &actual_size);
    return actual_size;
}
