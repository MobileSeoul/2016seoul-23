package org.playthm.core.security;

import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 *
 */
public class PasswordGenerator {
    /** 로그 */
    final static Logger         logger                  = LoggerFactory.getLogger( PasswordGenerator.class );

    /** 숫자, 소문자, 대문자 문자 배열 */
    private static final String WORDS[]                 = { "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
    /** 숫자 문자 배열 */
    private static final String WORDS_NO[]              = { "2", "3", "4", "5", "6", "7", "8", "9" };
    /** 소문자 문자 배열 */
    private static final String WORDS_LOWER[]           = { "a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" };
    /** 대문자 문자 배열 */
    private static final String WORDS_UPPER[]           = { "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
    /** 대문자 AND 숫자 문자 배열 */
    private static final String WORDS_UPPERNO[]         = { "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "2", "3", "4", "5", "6", "7", "8", "9" };

    /** 기본 형식 ( 8자 ) */
    public static final String  PASSTYPE_NORMAL         = "NORMAL";
    /** 소문자4자 숫자4자 형식 */
    public static final String  PASSTYPE_LOW4NO4        = "abcd1234";
    /** 대문자4자 숫자4자 형식 */
    public static final String  PASSTYPE_UPP4NO4        = "ABCD1234";
    /** 소문자2자 숫자2자 소문자2자 숫자2자 형식 */
    public static final String  PASSTYPE_LOW2NO2LOW2NO2 = "ab12cd34";
    /** 대문자 OR 숫자 10자 형식 */
    public static final String  RANDOM10                = "RANDOM10";

    /**
     * 비밀번호 생성<br/>
     *
     * @return 8자 길이 비밀번호
     */
    public static String getPassword() {
        return getPassword( 8 );
    }

    /**
     * 비밀번호 생성<br/>
     *
     * @param length 비밀번호 길이
     * @return 비밀번호
     */
    public static String getPassword(int length) {
        if ( length < 1 || length > 10 ) {
            length = 10;
        }

        String imsiPassword = "";

        for ( int i = 0; i < length; i++ ) {
            imsiPassword = getWord( imsiPassword, WORDS );
        }

        return imsiPassword;
    }

    /**
     * 비밀번호 생성<br/>
     *
     * @param passtype 비밀번호 타입
     * @return 비밀번호
     */
    public static String getPassword(String passtype) {
        String imsiPassword = "";

        // 소문자4자 숫자4자 형식
        if ( PASSTYPE_LOW4NO4.equals( passtype ) ) {
            for ( int i = 0; i < 4; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_LOWER );
            }
            for ( int i = 0; i < 4; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_NO );
            }
        }
        // 대문자4자 숫자4자 형식
        else if ( PASSTYPE_UPP4NO4.equals( passtype ) ) {
            for ( int i = 0; i < 4; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_UPPER );
            }
            for ( int i = 0; i < 4; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_NO );
            }
        }
        // 소문자2자 숫자2자 소문자2자 숫자2자 형식
        else if ( PASSTYPE_LOW2NO2LOW2NO2.equals( passtype ) ) {
            for ( int i = 0; i < 2; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_LOWER );
            }
            for ( int i = 0; i < 2; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_NO );
            }
            for ( int i = 0; i < 2; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_LOWER );
            }
            for ( int i = 0; i < 2; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_NO );
            }
        }
        // 대문자이거나 숫자인 10자 형식
        else if ( RANDOM10.equals( passtype ) ) {
            for ( int i = 0; i < 10; i++ ) {
                imsiPassword = getWord( imsiPassword, WORDS_UPPERNO );
            }
        }
        else {
            imsiPassword = getPassword( 8 );
        }

        return imsiPassword;
    }

    /**
     * 중복을 제외한 비밀번호 문자열 생성<br/>
     *
     * @param imsiPassword 지금까지 생성된 비밀번호 문자열
     * @param words 랜덤으로 뽑을 문자배열
     * @return 완성된 비밀번호 문자열
     */
    private static String getWord(String imsiPassword, String words[]) {
        Random random = new Random();

        String word = words[random.nextInt( words.length )];
        while ( imsiPassword.indexOf( word ) > -1 ) {
            word = words[random.nextInt( words.length )];
        }

        imsiPassword += word;

        return imsiPassword;
    }
}
