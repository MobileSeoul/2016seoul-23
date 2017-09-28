package org.playthm.core.util;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.PixelGrabber;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

/**
 *
 * @author Administrator
 *
 */
public class ImageUtil {

	/**
	 *
	 */
	private File imageFile = null;

	/**
	 *
	 */
	private Image image = null;

	/**
	 *
	 */
	private BufferedImage bufferedImage = null;

	/**
	 *
	 */
	public static enum ImageFormat {
		PNG("PNG"), JPG("JPG"), GIF("GIF"), BMP("BMP");

		private String formatName = "JPG";

		private ImageFormat(String formatName) {
			this.formatName = formatName;
		}

		public String getFormatName() {
			return this.formatName;
		}
	};

	/**
	 *
	 * @param filename
	 */
	public ImageUtil(String filename) {
		if (filename != null) {
			imageFile = new File(filename);
		}

		if (imageFile != null && imageFile.isFile()) {
			System.setProperty("java.awt.headless", "true");

			image = new ImageIcon(imageFile.getAbsolutePath()).getImage();
		}
	}

	/**
	 *
	 * @param url
	 * @param filename
	 */
	public ImageUtil(String url, String filename) {
		this(url, filename, 1024);
	}

	/**
	 *
	 * @param url
	 * @param filename
	 * @param bufferSize
	 */
	public ImageUtil(String url, String filename, int bufferSize) {
		if (url == null || filename == null) {
			return;
		}

		bufferSize = bufferSize < 0 ? 1024 : bufferSize;

		try {
			URL urlObj = new URL(url);
			InputStream is = urlObj.openStream();
			OutputStream fos = new FileOutputStream(filename);

			int readCount = 0;
			byte[] b = new byte[bufferSize];

			while ((readCount = is.read(b)) != -1) {
				fos.write(b, 0, readCount);
				fos.flush();
			}

			is.close();
			fos.close();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		imageFile = new File(filename);

		if (imageFile != null && imageFile.isFile()) {
			System.setProperty("java.awt.headless", "true");

			image = new ImageIcon(imageFile.getAbsolutePath()).getImage();
		}
	}

	/**
	 *
	 * @return
	 */
	public Image getImage() {
		return image;
	}

	/**
	 *
	 * @return
	 */
	public HashMap<String, Object> getInfo() {
		HashMap<String, Object> infoMap = new HashMap<String, Object>();

		if (image != null) {
			infoMap.put("name", imageFile.getName());
			infoMap.put("path", imageFile.getParent());
			infoMap.put("size",  imageFile.length());
			infoMap.put("ext", imageFile.getName().replaceAll("^.+[.]", ""));
			infoMap.put("width", image.getWidth(null));
			infoMap.put("height", image.getHeight(null));
		}

		return infoMap;
	}

	/**
	 *
	 * @return
	 */
	public int getWidth() {
		return image == null ? -1 : image.getWidth(null);
	}

	/**
	 *
	 * @return
	 */
	public int getHeight() {
		return image == null ? -1 : image.getHeight(null);
	}

	/**
	 *
	 * @param width
	 * @return
	 */
	public BufferedImage resizeByWidth(int width) {
		if (image == null) {
			return null;
		}

		int height = (int)((double)width / image.getWidth(null) * image.getHeight(null));

		bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

		int[] colorArray = new int[width * height];

		PixelGrabber pixelGrabber = new PixelGrabber(image.getScaledInstance(width, height, Image.SCALE_SMOOTH), 0, 0, width, height, colorArray, 0, width);

		try {
			pixelGrabber.grabPixels();
		} catch (Exception e) {
			e.printStackTrace();
			bufferedImage = null;
			return null;
		}

		bufferedImage.setRGB(0, 0, width, height, colorArray, 0, width);

		return bufferedImage;
	}

	/**
	 *
	 * @param height
	 * @return
	 */
	public BufferedImage resizeByHeight(int height) {
		if (image == null) {
			return null;
		}

		int width = (int)((double)height / image.getHeight(null) * image.getWidth(null));

		bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

		int[] colorArray = new int[width * height];

		PixelGrabber pixelGrabber = new PixelGrabber(image.getScaledInstance(width, height, Image.SCALE_SMOOTH), 0, 0, width, height, colorArray, 0, width);

		try {
			pixelGrabber.grabPixels();
		} catch (Exception e) {
			e.printStackTrace();
			bufferedImage = null;
			return null;
		}

		bufferedImage.setRGB(0, 0, width, height, colorArray, 0, width);

		return bufferedImage;
	}

	/**
	 *
	 * @param width
	 * @param height
	 * @return
	 */
	public BufferedImage resize(int width, int height) {
		if (image == null) {
			return null;
		}

		int scaleHeight = (int)((double)width / image.getWidth(null) * image.getHeight(null));

		if (scaleHeight > height) {
			return resizeByHeight(height);
		} else {
			return resizeByWidth(width);
		}
	}

	/**
	 *
	 * @param width
	 * @param height
	 * @return
	 */
	public BufferedImage resizeByFixed(int width, int height) {
		if (image == null) {
			return null;
		}

		int x = 0, y = 0;
		int scaleHeight = (int)((double)width / image.getWidth(null) * image.getHeight(null));
		int scaleWidth = (int)((double)height / image.getHeight(null) * image.getWidth(null));

		if (scaleHeight > height) {
			x = (width - scaleWidth) / 2;
			scaleHeight = height;
		} else {
			y = (height - scaleHeight) / 2;
			scaleWidth = width;
		}

		bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D g2d = (Graphics2D)bufferedImage.createGraphics();
		g2d.setColor(Color.white);
		g2d.fillRect(0, 0, width, height);
		g2d.dispose();

		int[] colorArray = new int[width * height];

		PixelGrabber pixelGrabber = new PixelGrabber(image.getScaledInstance(scaleWidth, scaleHeight, Image.SCALE_SMOOTH), 0, 0, scaleWidth, scaleHeight, colorArray, 0, width);

		try {
			pixelGrabber.grabPixels();
		} catch (Exception e) {
			e.printStackTrace();
			bufferedImage = null;
			return null;
		}

		bufferedImage.setRGB(x, y, scaleWidth, scaleHeight, colorArray, 0, width);

		return bufferedImage;
	}

	/**
	 *
	 * @param saveFilename
	 * @param formatName
	 * @return
	 * @throws InterruptedException
	 * @throws IOException
	 */
	public File saveAs(String saveFilename, ImageFormat formatName) throws InterruptedException, IOException {
		if (image == null) {
			return null;
		}

		if (bufferedImage == null) {
			if (resize(getWidth(), getHeight()) == null) {
				return null;
			}
		}

		File saveFile = new File(saveFilename);

		if (saveFile.isFile()) {
			saveFile.delete();
		}

		FileOutputStream fos = new FileOutputStream(saveFilename);

		ImageIO.write(bufferedImage, formatName.getFormatName(), fos);

		fos.close();

		if (saveFile.isFile()) {
			return saveFile;
		} else {
			return null;
		}
	}

	/**
	 *
	 * @param saveFilename
	 * @return
	 */
	public File saveAsOrigin(String saveFilename) {
		return saveAsOrigin(saveFilename, 1024);
	}

	/**
	 *
	 * @param saveFilename
	 * @param bufferSize
	 * @return
	 */
	public File saveAsOrigin(String saveFilename, int bufferSize) {
		if (imageFile == null) {
			return null;
		}

		bufferSize = bufferSize < 0 ? 1024 : bufferSize;

		File saveFile = new File(saveFilename);

		if (saveFile.isFile()) {
			saveFile.delete();
		}

		try {
			FileInputStream fis = new FileInputStream(imageFile);
			FileOutputStream fos = new FileOutputStream(saveFilename);

			int readCount = 0;
			byte[] b = new byte[bufferSize];

			while ((readCount = fis.read(b)) != -1) {
				fos.write(b, 0, readCount);
				fos.flush();
			}

			fis.close();
			fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}

		return saveFile;
	}
}
