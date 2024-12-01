export const ArrayBenchmarks = {
    MAX: 'max',
    SPLIT_ON: 'splitOn',
    CHUNK: 'chunk',
    ROLLING_WINDOW: 'rollingWindow',
} as const;

export const BitsBenchmarks = {
    HEX_TO_PADDED_BINARY_SMALL: 'hexToPaddedBinary-small',
    HEX_TO_PADDED_BINARY_MEDIUM: 'hexToPaddedBinary-medium',
    HEX_TO_PADDED_BINARY_LARGE: 'hexToPaddedBinary-large',
    BIT_STRING_TO_NUMBER_16: 'bitStringToNumber-16',
    BIT_STRING_TO_NUMBER_32: 'bitStringToNumber-32',
    BIT_STRING_TO_NUMBER_53: 'bitStringToNumber-53',
    BITS_TO_NUMBER_16: 'bitsToNumber-16',
    BITS_TO_NUMBER_32: 'bitsToNumber-32',
    BITS_TO_NUMBER_53: 'bitsToNumber-53',
    BIT_SUBSTRING_SMALL: 'bitSubstring-small',
    BIT_SUBSTRING_MEDIUM: 'bitSubstring-medium',
    BIT_SUBSTRING_LARGE: 'bitSubstring-large',
} as const;

export const StringViewBenchmarks = {
    CREATE_SMALL: 'create-small',
    CREATE_LARGE: 'create-large',
    CHAR_AT_ASCII: 'charAt-ascii',
    CHAR_AT_UNICODE: 'charAt-unicode',
    ITERATE_ASCII: 'iterate-ascii',
    ITERATE_UNICODE: 'iterate-unicode',
    TRIM_SMALL: 'trim-small',
    TRIM_LARGE: 'trim-large',
    CHOP_LEFT_ASCII: 'chopLeft-ascii',
    CHOP_LEFT_UNICODE: 'chopLeft-unicode',
    PARSE_INT: 'parseInt',
    PARSE_FLOAT: 'parseFloat',
    COMPLEX_EMOJI_HANDLING: 'complex-emoji-handling',
    CACHED_SEGMENTATION: 'cached-segmentation',
    CHOP_INT_SIMPLE: 'chopInt-simple',
    CHOP_INT_SIGNED: 'chopInt-signed',
    CHOP_INT_MIXED: 'chopInt-mixed',
    CHOP_FLOAT_SIMPLE: 'chopFloat-simple',
    CHOP_FLOAT_SIGNED: 'chopFloat-signed',
    CHOP_FLOAT_MIXED: 'chopFloat-mixed',
} as const;
