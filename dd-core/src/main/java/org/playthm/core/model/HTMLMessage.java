package org.playthm.core.model;

/**
 *
 * @author Administrator
 *
 */
public class HTMLMessage {

	/**
	 *
	 */
	public static enum TARGET {SELF, NEW, OPENER, OPENER_CLOSE, POPUP, CLOSE, BACK};

	/**
	 *
	 */
	public static enum METHOD {GET_REPLACE, GET, POST};


	/**
	 *
	 */
	private String message;

	/**
	 *
	 */
	private String href;

	/**
	 *
	 */
	private TARGET target;

	/**
	 *
	 */
	private METHOD method;


	/**
	 *
	 * @param message
	 * @param href
	 */
	public HTMLMessage(String message, String href) {
		this(message, href, null, null);
	}

	/**
	 *
	 * @param message
	 * @param href
	 * @param target
	 */
	public HTMLMessage(String message, String href, TARGET target) {
		this(message, href, target, null);
	}

	/**
	 *
	 * @param message
	 * @param href
	 * @param target
	 * @param method
	 */
	public HTMLMessage(String message, String href, TARGET target, METHOD method) {
		this.message = (message == null ? "" : message);
		this.href = (href == null || "".equals(href) ? "/" : href);
		this.target = (target == null ? TARGET.SELF : target);
		this.method = (method == null ? METHOD.GET_REPLACE : method);
	}

	/**
	 *
	 * @return
	 */
	public String getMessage() {
		return message;
	}

	/**
	 *
	 * @param message
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 *
	 * @return
	 */
	public String getHref() {
		return href;
	}

	/**
	 *
	 * @param href
	 */
	public void setHref(String href) {
		this.href = href;
	}

	/**
	 *
	 * @return
	 */
	public TARGET getTarget() {
		return target;
	}

	/**
	 *
	 * @param target
	 */
	public void setTarget(TARGET target) {
		this.target = target;
	}

	/**
	 *
	 * @return
	 */
	public METHOD getMethod() {
		return method;
	}

	/**
	 *
	 * @param method
	 */
	public void setMethod(METHOD method) {
		this.method = method;
	}

	/**
	 *
	 */
	@Override
	public String toString() {
		return "HTMLMessage [message=" + message + ", href=" + href
				+ ", target=" + target + ", method=" + method + "]";
	}
}
