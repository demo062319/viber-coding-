// 全局状态
let currentLanguage = 'java';
let currentSection = 'code-generation';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeLanguageSelectors();
    initializeCodeGeneration();
    initializeAutoComplete();
    initializeCodeAnalysis();
    initializeSettings();
    loadApiKey();
});

// 导航切换
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 更新内容区域
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            currentSection = sectionId;
        });
    });
}

// 语言选择器
function initializeLanguageSelectors() {
    document.querySelectorAll('.language-selector').forEach(selector => {
        const buttons = selector.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLanguage = btn.dataset.lang;
            });
        });
    });
}

// 代码生成功能
function initializeCodeGeneration() {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-code-btn');
    
    generateBtn.addEventListener('click', handleGenerateCode);
    copyBtn.addEventListener('click', () => copyToClipboard('code-output'));
}

async function handleGenerateCode() {
    const prompt = document.getElementById('code-prompt').value.trim();
    const context = document.getElementById('code-context').value.trim();
    
    if (!prompt) {
        showError('code-output', '请输入需求描述');
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await window.electronAPI.generateCode({
            type: currentLanguage,
            prompt,
            language: currentLanguage,
            context
        });
        
        if (result.success) {
            displayCode('code-output', result.code);
        } else {
            showError('code-output', `生成失败: ${result.error}`);
        }
    } catch (error) {
        showError('code-output', `错误: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// 智能补全功能
function initializeAutoComplete() {
    const autocompleteBtn = document.getElementById('autocomplete-btn');
    const copyBtn = document.getElementById('copy-autocomplete-btn');
    
    autocompleteBtn.addEventListener('click', handleAutoComplete);
    copyBtn.addEventListener('click', () => copyToClipboard('autocomplete-output'));
}

async function handleAutoComplete() {
    const code = document.getElementById('autocomplete-input').value.trim();
    
    if (!code) {
        showError('autocomplete-output', '请输入代码片段');
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await window.electronAPI.autoComplete({
            code,
            language: currentLanguage
        });
        
        if (result.success) {
            displayCode('autocomplete-output', result.completion);
        } else {
            showError('autocomplete-output', `补全失败: ${result.error}`);
        }
    } catch (error) {
        showError('autocomplete-output', `错误: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// 代码分析功能
function initializeCodeAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    
    analyzeBtn.addEventListener('click', handleCodeAnalysis);
}

async function handleCodeAnalysis() {
    const code = document.getElementById('analysis-input').value.trim();
    
    if (!code) {
        showError('analysis-output', '请输入要分析的代码');
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await window.electronAPI.analyzeCode({
            code,
            language: currentLanguage
        });
        
        if (result.success) {
            displayAnalysis('analysis-output', result.analysis);
        } else {
            showError('analysis-output', `分析失败: ${result.error}`);
        }
    } catch (error) {
        showError('analysis-output', `错误: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// 设置功能
function initializeSettings() {
    const saveBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    
    saveBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            alert('请输入API Key');
            return;
        }
        
        try {
            await window.electronAPI.saveApiKey(apiKey);
            alert('设置已保存');
        } catch (error) {
            alert(`保存失败: ${error.message}`);
        }
    });
}

async function loadApiKey() {
    try {
        const apiKey = await window.electronAPI.getApiKey();
        document.getElementById('api-key-input').value = apiKey;
    } catch (error) {
        console.error('加载API Key失败:', error);
    }
}

// 工具函数
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function displayCode(outputId, code) {
    const output = document.getElementById(outputId);
    output.innerHTML = `<pre><code>${escapeHtml(code)}</code></pre>`;
}

function displayAnalysis(outputId, analysis) {
    const output = document.getElementById(outputId);
    const formattedAnalysis = formatAnalysis(analysis);
    output.innerHTML = formattedAnalysis;
}

function formatAnalysis(analysis) {
    // 将文本中的换行符转换为HTML
    const lines = analysis.split('\n');
    let html = '';
    
    lines.forEach(line => {
        if (line.startsWith('##') || line.startsWith('###')) {
            html += `<h4 style="color: #fbbf24; margin: 16px 0 8px 0;">${escapeHtml(line.replace(/#+\s*/, ''))}</h4>`;
        } else if (line.startsWith('-')) {
            html += `<li style="margin: 8px 0 8px 20px;">${escapeHtml(line.replace(/^-\s*/, ''))}</li>`;
        } else if (line.startsWith('**') && line.endsWith('**')) {
            html += `<strong style="color: #60a5fa;">${escapeHtml(line.replace(/\*\*/g, ''))}</strong>`;
        } else if (line.trim()) {
            html += `<p style="margin: 8px 0;">${escapeHtml(line)}</p>`;
        }
    });
    
    return html;
}

function showError(outputId, message) {
    const output = document.getElementById(outputId);
    output.innerHTML = `<div style="color: #ef4444; padding: 16px;">${escapeHtml(message)}</div>`;
}

function copyToClipboard(outputId) {
    const output = document.getElementById(outputId);
    const text = output.textContent || output.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById(outputId === 'code-output' ? 'copy-code-btn' : 'copy-autocomplete-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981"><path d="M20 6L9 17l-5-5"/></svg>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 1500);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
