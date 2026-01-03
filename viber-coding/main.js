const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Viber Coding - 智能编程助手'
  });

  mainWindow.loadFile('index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-api-key', () => {
  return store.get('deepseekApiKey') || '';
});

ipcMain.handle('save-api-key', (event, apiKey) => {
  store.set('deepseekApiKey', apiKey);
  return { success: true };
});

ipcMain.handle('generate-code', async (event, { type, prompt, language, context }) => {
  const apiKey = store.get('deepseekApiKey') || '';
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的编程助手，精通Java和Vue开发。请根据用户的需求生成高质量的代码。
- 如果是Java代码生成，请遵循Java最佳实践，使用Spring Boot框架
- 如果是Vue代码生成，请使用Vue 3 Composition API
- 代码要有良好的注释和结构
- 代码要完整可运行`
          },
          {
            role: 'user',
            content: `${type === 'java' ? 'Java' : 'Vue'}代码生成需求：${prompt}\n\n${context ? `上下文代码：\n${context}` : ''}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      code: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('auto-complete', async (event, { code, cursorPosition, language }) => {
  const apiKey = store.get('deepseekApiKey') || '';
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个智能代码补全助手。请根据用户提供的代码片段，智能补全接下来的代码。只返回补全的代码部分，不要解释。语言：${language}`
          },
          {
            role: 'user',
            content: `补全以下代码：\n${code}\n\n请从光标位置开始补全。`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      completion: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('analyze-code', async (event, { code, language }) => {
  const apiKey = store.get('deepseekApiKey') || '';
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的代码分析助手。请分析用户提供的代码，给出详细的分析报告，包括：1. 代码结构分析 2. 潜在问题和改进建议 3. 最佳实践建议 4. 性能优化建议`
          },
          {
            role: 'user',
            content: `请分析以下${language}代码：\n\n${code}`
          }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      analysis: data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});
