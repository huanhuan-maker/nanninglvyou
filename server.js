const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 初始化留言文件
try {
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, '[]', 'utf8');
    console.log('初始化messages.json成功');
  }
} catch (err) {
  console.error('初始化留言文件失败:', err);
}

// 接口：获取所有留言
app.get('/api/messages', (req, res) => {
  fs.readFile(MESSAGES_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('读取留言失败:', err);
      return res.status(500).json({ error: '读取留言失败' });
    }
    try {
      const messages = JSON.parse(data || '[]');
      res.json(messages);
    } catch (parseErr) {
      res.status(500).json({ error: '解析留言数据失败' });
    }
  });
});

// 接口：提交新留言
app.post('/api/messages', (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: '留言内容不能为空' });
  }

  fs.readFile(MESSAGES_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('读取留言失败:', err);
      return res.status(500).json({ error: '读取留言失败' });
    }

    try {
      const messages = JSON.parse(data || '[]');
      messages.push({
        content: content.trim(),
        timestamp: new Date().toISOString()
      });

      fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('保存留言失败:', err);
          return res.status(500).json({ error: '保存留言失败' });
        }
        res.status(201).json({ success: true });
      });
    } catch (parseErr) {
      res.status(500).json({ error: '解析留言数据失败' });
    }
  });
});

// 启动服务器 + 错误监听
app.listen(PORT, () => {
  console.log('服务器已启动：http://localhost:' + PORT);
  console.log('访问留言板：http://localhost:' + PORT + '/message.html');
}).on('error', (err) => {
  console.error('服务器启动失败:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('端口' + PORT + '被占用，建议修改为3001后重试');
  }
});