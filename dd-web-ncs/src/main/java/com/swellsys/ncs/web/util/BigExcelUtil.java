package com.swellsys.ncs.web.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * Demonstrates a workaround you can use to generate large workbooks and avoid
 * OutOfMemory exception.
 * 
 * The trick is as follows: 1. create a template workbook, create sheets and
 * global objects such as cell styles, number formats, etc. 2. create an
 * application that streams data in a text file 3. Substitute the sheet in the
 * template with the generated data
 * 
 * See <a
 * "http://poi.apache.org/spreadsheet/how-to.html#sxssf">http://poi.apache
 * .org/spreadsheet/how-to.html#sxssf</a>.
 */
public class BigExcelUtil {

	private static final String XML_ENCODING = "UTF-8";
	private static final String TEMPLATE_NAME = "template.xlsx";

	public boolean makeExcel(HttpServletRequest request, HttpServletResponse response, String[] title, HashMap<String, Object> resultMap, String fileNm)
			throws Exception {
		
		@SuppressWarnings("deprecation")
		String savepath = request.getRealPath("/")+"WEB-INF/files/";
		
		
		// - XSSFWorkbook
		// High level representation of a SpreadsheetML workbook.
		// This is the first object most users will construct whether they are
		// reading or writing a workbook.
		// It is also the top level object for creating new sheets/etc.

		// 워크북을 만들고
		// Create a new SpreadsheetML workbook.
		XSSFWorkbook workbook = new XSSFWorkbook();

		// - XSSFSheet
		// High level representation of a SpreadsheetML worksheet.
		// Sheets are the central structures within a workbook, and are where a
		// user does most of his spreadsheet work.
		// The most common type of sheet is the worksheet, which is represented
		// as a grid of cells.
		// Worksheet cells can contain text, numbers, dates, and formulas. Cells
		// can also be formatted.

		// 거기에 시트를 추가하자.
		// Create a new sheet for this Workbook and return the high level
		// representation.
		XSSFSheet sheet = workbook.createSheet("Sheet1");

		// - XSSFCellStyle
		// High level representation of the the possible formatting information
		// for the contents of the cells on a sheet in a SpreadsheetML document.

		// 그리고 셀 스타일도 만들어서 map에다 넣어 두자.
		// Create a new XSSFCellStyle and add it to the workbook's style table.
		Map<String, XSSFCellStyle> cellstyles = createStyles(workbook);

		// 뭔가 이름을 가져온다는데 뭔지 잘... 어쨌든 이름을 가져오자.
		// getPackagePart() : Provides access to the underlying PackagePart.
		// Return : the underlying PackagePart
		// getPartName()
		// Return : the uri
		// getName() : Get this part name.
		// Return : The name of this part name.
		String sheetRef = sheet.getPackagePart().getPartName().getName();

		// -----------------------------------------------
		// Step 1. save the template
		// -----------------------------------------------

		// - FileOutputStream
		// A file output stream is an output stream for writing data to a File
		// or to a FileDescriptor.
		// Whether or not a file is available or may be created depends upon the
		// underlying platform.
		// Some platforms, in particular, allow a file to be opened for writing
		// by only one FileOutputStream (or other file-writing object) at a
		// time.
		// In such situations the constructors in this class will fail if the
		// file involved is already open.
		// FileOutputStream is meant for writing streams of raw bytes such as
		// image data.
		// For writing streams of characters, consider using FileWriter.

		FileOutputStream fileoutputstream = null;
		try {
			// template.xlsx라고 하는 임시 파일에 저장하는(아마 현재 없는 파일일테니 새로 생성할거임) 아웃풋 스트림을
			// 생성하고,
			// Creates a file output stream to write to the file with the
			// specified name.
			fileoutputstream = new FileOutputStream(savepath + TEMPLATE_NAME);

			// 거기에 워크북을 저장하자.(아무 내용도 들어있지 않을거다)
			// Write out this workbook to an Outputstream.
			workbook.write(fileoutputstream);

			// 그리고 Stream을 닫아야겠지.
			// Closes this file output stream and releases any system resources
			// associated with this stream.
			fileoutputstream.close();
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		} finally {
			if (fileoutputstream != null)
				fileoutputstream.close();
		}

		// -----------------------------------------------
		// Step 2. Generate XML file.
		// -----------------------------------------------

		// sheet로 시작해서 .xml로 끝나는 임시 파일을 생성하자(위치는 시스템내 temp 디렉토리)
		// Creates an empty file in the default temporary-file directory, using
		// the given prefix and suffix to generate its name.
		// Return : An abstract pathname denoting a newly-created empty file
		File tempfile = File.createTempFile("sheet", ".xml");

		// - Writer
		// Abstract class for writing to character streams.
		// The only methods that a subclass must implement are write(char[],
		// int, int), flush(), and close().

		Writer outputstreamwriter = null;
		try {
			// - OutputStreamWriter
			// An OutputStreamWriter is a bridge from character streams to byte
			// streams:
			// Characters written to it are encoded into bytes using a specified
			// charset.
			// The charset that it uses may be specified by name or may be given
			// explicitly, or the platform's default charset may be accepted.

			// sheet.xml에 저장하는 outputstream으로, 지정된 인코딩(UTF-8)로 저장하는 writer를
			// 생성하자.
			// Creates a file output stream to write to the file represented by
			// the specified File object.
			outputstreamwriter = new OutputStreamWriter(new FileOutputStream(tempfile), XML_ENCODING);

			// 실제 데이터를 생성하고 스타일도 입혀 보자.
			// 상세한 내용은 주석 확인
			dataGenerate(outputstreamwriter, cellstyles, title, resultMap);

			// 셀 너비를 이쁘게 정돈하자.(작동 안하네...)
			for (int i = 0; i < title.length; i++) {
				// Adjusts the column width to fit the contents.
				sheet.autoSizeColumn(i);
			}

			// Closes the stream, flushing it first.
			outputstreamwriter.close();
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		} finally {
			if (outputstreamwriter != null)
				outputstreamwriter.close();
		}
		// -----------------------------------------------
		// Step 3. Substitute the template entry with the generated data
		FileOutputStream fileoutputstream2 = null;
		// OutputStream fo = null;
		try {

			// 입력 받은 파일명의 파일에 저장하는(아마 현재 없는 파일일테니 새로 생성할거임) 아웃풋 스트림을 생성하고,
			// Creates a file output stream to write to the file with the
			// specified name.
			fileoutputstream2 = new FileOutputStream(savepath + fileNm);

			// 여차저차해서 방금 생성한 파일(입력된 파일명)에 아까 생성한 데이터(sheet.xml)를 붙여 넣는다.
			// 상세한 내용은 주석 확인
			boolean result = substitute(new File(savepath + TEMPLATE_NAME), tempfile, sheetRef.substring(1), fileoutputstream2);

			// 파일을 다운로드 하고,
			result = FileUploadUtil.fileDownload(request, response, savepath, fileNm, fileNm);
			
			if (result) {
				File file = new File(savepath + fileNm);
				// 만들어둔 파일은 삭제하자.
				// Deletes the file or directory denoted by this abstract
				// pathname.
				if (file.exists())
					file.delete();
			}

		} catch (Exception ex) {
			throw new RuntimeException(ex);
		} finally {
			// Closes the stream, flushing it first.
			if (fileoutputstream2 != null)
				fileoutputstream2.close();
		}

		return true;
	}

	/**
	 * Create a library of cell styles.
	 */
	public Map<String, XSSFCellStyle> createStyles(XSSFWorkbook workbook) throws Exception {
		// 셀 스타일 저장을 위한 맵을 생성한다.
		Map<String, XSSFCellStyle> cellstyles = new HashMap<String, XSSFCellStyle>();

		/*
		 * XSSFDataFormat fmt = wb.createDataFormat();
		 * 
		 * XSSFCellStyle style1 = wb.createCellStyle();
		 * style1.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
		 * style1.setDataFormat(fmt.getFormat("0.0%")); styles.put("percent",
		 * style1);
		 * 
		 * XSSFCellStyle style2 = wb.createCellStyle();
		 * style2.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		 * style2.setDataFormat(fmt.getFormat("0.0X")); styles.put("coeff",
		 * style2);
		 * 
		 * XSSFCellStyle style3 = wb.createCellStyle();
		 * style3.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
		 * style3.setDataFormat(fmt.getFormat("$#,##0.00"));
		 * styles.put("currency", style3);
		 * 
		 * XSSFCellStyle style4 = wb.createCellStyle();
		 * style4.setAlignment(XSSFCellStyle.ALIGN_RIGHT);
		 * style4.setDataFormat(fmt.getFormat("mmm dd")); styles.put("date",
		 * style4);
		 * 
		 * XSSFCellStyle style5 = wb.createCellStyle(); XSSFFont headerFont =
		 * wb.createFont(); headerFont.setBold(true);
		 * style5.setFillForegroundColor
		 * (IndexedColors.GREY_25_PERCENT.getIndex());
		 * style5.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
		 * style5.setFont(headerFont); styles.put("header", style5);
		 */

		/*
		 * XSSFCellStyle style = wb.createCellStyle();
		 * style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		 * style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		 * style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		 * style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		 */

		// 헤더셀의 스타일을 추가한다. (폰트 두께, 테두리 설정)
		// Create a new XSSFCellStyle and add it to the workbook's style table.
		// http://poi.apache.org/apidocs/org/apache/poi/xssf/usermodel/XSSFCellStyle.html
		XSSFCellStyle cellstyles1 = workbook.createCellStyle();
		XSSFFont font1 = workbook.createFont();
		font1.setBold(true);
		// font1.setFontHeight(11);
		// cellstyles1.setFillForegroundColor(IndexedColors.ORANGE.getIndex());
		// cellstyles1.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
		cellstyles1.setBorderRight(XSSFCellStyle.BORDER_THIN); // 테두리 설정
		cellstyles1.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		cellstyles1.setBorderTop(XSSFCellStyle.BORDER_THIN);
		cellstyles1.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		// cellstyles1.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		cellstyles1.setFont(font1);
		cellstyles.put("header", cellstyles1);

		// 데이터셀의 스타일을 추가한다.(테두리, 텍스트 줄 바꿈 설정)
		// Create a new XSSFCellStyle and add it to the workbook's style table.
		// http://poi.apache.org/apidocs/org/apache/poi/xssf/usermodel/XSSFCellStyle.html
		XSSFCellStyle cellstyles2 = workbook.createCellStyle();
		// XSSFFont font2 = wb.createFont();
		// font2.setFontHeight(11);
		cellstyles2.setBorderRight(XSSFCellStyle.BORDER_THIN); // 테두리 설정
		cellstyles2.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		cellstyles2.setBorderTop(XSSFCellStyle.BORDER_THIN);
		cellstyles2.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		// cellstyles2.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		// cellstyles2.setWrapText(true);
		// cellstyles2.setFont(font2);
		cellstyles.put("data", cellstyles2);

		return cellstyles;
	}

	public void dataGenerate(Writer out, Map<String, XSSFCellStyle> styles, String[] title, HashMap<String, Object> resultMap) throws Exception {
		SpreadsheetWriter sw = new SpreadsheetWriter(out);
		sw.beginSheet();

		int styleIndex = styles.get("header").getIndex();
		int styleDataIdx = styles.get("data").getIndex();

		// 먼저 헤더를 생성한다.
		// 헤더는 Excel 다운로드시에 파라미터로 받아온다.
		// header title 개수와 데이터 테이블(ArrayList) 내의 Row에 넣어주는 데이터의 컬럼의 개수를 일치시켜 주는
		// 것을 잊지 말자.
		// insert header row
		sw.insertRow(0);

		for (int i = 0; i < title.length; i++) {
			sw.createCell(i, title[i], styleIndex);
		}

		sw.endRow();

		// 데이터를 모두 ArrayList(테이블)안의 ArrayList(행)에 담아서 던져야 한다.
		// write data rows
		@SuppressWarnings("unchecked")
		ArrayList<ArrayList<String>> table = (ArrayList<ArrayList<String>>) resultMap.get("list");

		for (int i = 0; i < table.size(); i++) {
			sw.insertRow(i + 1);

			ArrayList<String> row = table.get(i);

			for (int j = 0; j < row.size(); j++) {
				if( row.get(j) != null)
					sw.createCell(j, row.get(j).replace("&", "&amp;").replace("<", "$&lt;").replace(">", "&gt;"), styleDataIdx);
				else
					sw.createCell(j, "", styleDataIdx);
			}

			sw.endRow();
		}
		sw.endSheet();
	}

	/**
	 * 
	 * @param templateFile
	 *            the template file
	 * @param tempFile
	 *            the XML file with the sheet data
	 * @param entry
	 *            the name of the sheet entry to substitute, e.g.
	 *            xl/worksheets/sheet1.xml
	 * @param outputStream
	 *            the stream to write the result to
	 */
	public boolean substitute(File templateFile, File tempFile, String entry, OutputStream outputStream) throws IOException {
		// 템플릿 파일로부터 zip 파일을 생성한다
		// - ZipFile
		// This class is used to read entries from a zip file.
		// Unless otherwise noted, passing a null argument to a constructor or
		// method in this class will cause a NullPointerException to be thrown.
		ZipFile zipFile = new ZipFile(templateFile);

		// 입력 받은 아웃풋 스트림(실제 최종 다운 파일)으로부 집 아웃풋 스트림을 생성한다
		// - ZipOutputStream
		// This class implements an output stream filter for writing files in
		// the ZIP file format.
		// Includes support for both compressed and uncompressed entries.
		ZipOutputStream zipOutputStream = new ZipOutputStream(outputStream);

		@SuppressWarnings("unchecked")
		Enumeration<ZipEntry> zipEntry = (Enumeration<ZipEntry>) zipFile.entries();
		while (zipEntry.hasMoreElements()) {
			ZipEntry localZipEntry = zipEntry.nextElement();
			if (!localZipEntry.getName().equals(entry)) {
				zipOutputStream.putNextEntry(new ZipEntry(localZipEntry.getName()));
				InputStream inputStream = zipFile.getInputStream(localZipEntry);
				copyStream(inputStream, zipOutputStream);
				inputStream.close();
			}
		}
		zipOutputStream.putNextEntry(new ZipEntry(entry));
		InputStream inputStream = new FileInputStream(tempFile);
		copyStream(inputStream, zipOutputStream);
		inputStream.close();

		zipFile.close();
		zipOutputStream.close();

		return true;
	}

	// in Stream의 데이터를 1024 바이트 단위로 잘라서 out Stream에 복사해준다.
	public void copyStream(InputStream in, OutputStream out) throws IOException {
		byte[] chunk = new byte[1024];
		int count;
		while ((count = in.read(chunk)) >= 0) {
			out.write(chunk, 0, count);
		}
	}
	
}