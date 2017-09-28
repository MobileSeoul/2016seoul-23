package org.playthm.core.security;

public class AnsiX923Padding implements CryptoPadding {

    /** 패딩 규칙 이름 */
    private String name = "ANSI-X.923-Padding";

    private final byte PADDING_VALUE = 0x00;

    /**
     * 요청한 Block Size를 맞추기 위해 Padding을 추가한다.
     *
     * @param source
     *            byte[] 패딩을 추가할 bytes
     * @param blockSize
     *            int block size
     * @return byte[] 패딩이 추가 된 결과 bytes
     */
    public byte[] addPadding(byte[] source, int blockSize) {
        int paddingCnt = source.length % blockSize;
        byte[] paddingResult = null;

//     System.out.println("addPadding source.length:"+ source.length + " blockSize:" + blockSize + " paddingCnt:"+paddingCnt);

        if(paddingCnt != 0) {
            paddingResult = new byte[source.length + (blockSize - paddingCnt)];

            System.arraycopy(source, 0, paddingResult, 0, source.length);

            // 패딩해야 할 갯수 - 1 (마지막을 제외)까지 0x00 값을 추가한다.
            int addPaddingCnt = blockSize - paddingCnt;
            for(int i=0;i<addPaddingCnt;i++) {
                paddingResult[source.length + i] = PADDING_VALUE;
            }

            // 마지막 패딩 값은 패딩 된 Count를 추가한다.
            paddingResult[paddingResult.length - 1] = (byte)addPaddingCnt;
        } else {
            paddingResult = source;
        }

        return paddingResult;
    }

    /**
     * 요청한 Block Size를 맞추기 위해 추가 된 Padding을 제거한다.
     *
     * @param source
     *            byte[] 패딩을 제거할 bytes
     * @param blockSize
     *            int block size
     * @return byte[] 패딩이 제거 된 결과 bytes
     */
    public byte[] removePadding(byte[] source, int blockSize) {
        byte[] paddingResult = null;
        boolean isPadding = false;

        // 패딩 된 count를 찾는다.
        int lastValue = source[source.length - 1];

       //2011-09-06 JIH 은행에서 제공받은건데 오류가 있었다! 고생했다.. 고치니 잘된다.
       //System.out.println("removePadding source.length:"+ source.length + " blockSize:" + blockSize + " lastValue:"+lastValue);
       //if(lastValue < (blockSize-1)) {
        if(lastValue < (blockSize)) {
            int zeroPaddingCount = lastValue - 1;

            for(int i=2;i<(zeroPaddingCount + 2);i++) {
                if(source[source.length - i] != PADDING_VALUE) {
                    isPadding = false;
                    break;
                }
            }

            isPadding = true;
        } else {
            // 마지막 값이 block size 보다 클 경우 패딩 된것이 없음.
            isPadding = false;
        }

        if(isPadding) {
            paddingResult = new byte[source.length - lastValue];
            System.arraycopy(source, 0, paddingResult, 0, paddingResult.length);
        } else {
            paddingResult = source;
        }

        return paddingResult;
    }

    public String getName() {
        return name;
    }

}