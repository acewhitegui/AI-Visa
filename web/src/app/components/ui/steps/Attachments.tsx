"use client";

export function Attachments({conversationId}: { conversationId: string }) {
  return (
    <>
      <div className="upload-form">
        <h2>文件上传</h2>
        <form>
          <div className="upload-section">
            <h3>图片文件 (最多3个)</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 3) {
                  alert('最多只能上传3个图片文件');
                }
              }}
            />
          </div>

          <div className="upload-section">
            <h3>PDF文档 (最多1个)</h3>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 1) {
                  alert('最多只能上传1个PDF文件');
                }
              }}
            />
          </div>

          <div className="upload-section">
            <h3>Excel文件 (最多2个)</h3>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 2) {
                  alert('最多只能上传2个Excel文件');
                }
              }}
            />
          </div>

          <button type="submit">提交</button>
        </form>
        <div>会话ID: {conversationId}</div>
      </div>
    </>
  )
}