package org.playthm.core.util;

import java.util.Date;

public class FormatUtil {
	
	public static Number toNumber(Object value) {
		return toNumber(value, 0);
	}
	
	public static Number toNumber(Object value, Number defaultValue) {
		double d = toDouble(value, toDouble(defaultValue));
		long l = (long)d;
		
		if (d == l) {
			return l;
		} else {
			return d;
		}
	}
	

	public static int toInt(Object value) {
		return toInt(value, 0);
	}

	public static int toInt(Object value, int defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		
        try {
            return Integer.parseInt(value.toString());
        } catch (final Exception e) {
            return defaultValue;
        }
	}
	
	
	
	public static long toLong(Object value) {
		return toLong(value, 0L);
	}

	public static long toLong(Object value, long defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		
        try {
            return Long.parseLong(value.toString());
        } catch (final Exception e) {
            return defaultValue;
        }
	}
	
	
	
	public static float toFloat(Object value) {
		return toFloat(value, 0f);
	}

	public static float toFloat(Object value, float defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		
        try {
            return Float.parseFloat(value.toString());
        } catch (final Exception e) {
            return defaultValue;
        }
	}
	
	
	
	public static double toDouble(Object value) {
		return toDouble(value, 0d);
	}

	public static double toDouble(Object value, double defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		
        try {
            return Double.parseDouble(value.toString());
        } catch (final Exception e) {
            return defaultValue;
        }
	}
	
	
	
	public static double toShort(Object value) {
		return toShort(value, (short)0);
	}

	public static double toShort(Object value, short defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		
        try {
            return Short.parseShort(value.toString());
        } catch (final Exception e) {
            return defaultValue;
        }
	}
	
	
	
	public static double round(Object value, int pos) {
		return round(value, 0d, pos);
	}
	
	public static double round(Object value, double defaultValue, int pos) {
		double d = toDouble(value, defaultValue);
		return Math.round(d * Math.pow(10, pos)) / Math.pow(10, pos);
	}
	
	
	
	public static String toString(Object value) {
		return toString(value, "");
	}
		
	public static String toString(Object value, String defaultValue) {
		if (value == null) {
			return defaultValue;
		} else {
			return value.toString();
		}
	}
		
	public static String toStringValue(Object value, String defaultValue) {
		String val = toString(value);
		return "".equals(val) ? defaultValue : val;
	}
	
	
	
	public static boolean toBoolean(Object value) {
		return toBoolean(value, false);
	}
	
	public static boolean toBoolean(Object value, Boolean defaultValue) {
		if (value == null) {
			return defaultValue;
		}

        try {
            return Boolean.parseBoolean(value.toString());
        } catch (final Exception e) {
        	if (value.toString().matches("^(Y|YES|1)$gi")) {
        		return true;
        	} else if (value.toString().matches("^(N|NO|0)$gi")) {
        		return false;
        	}
        	
            return defaultValue;
        }
	}
	
	
	
	@SuppressWarnings("deprecation")
	public static Date toDate(Object value, Date defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		
        try {
            return new Date(Date.parse(value.toString()));
        } catch (final Exception e) {
            return defaultValue;
        }
	}
}
