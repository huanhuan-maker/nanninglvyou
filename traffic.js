// 交通出行页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 确保背景图片加载完成
    const bgImage = new Image();
    bgImage.src = 'image/bg.jpg';
    
    bgImage.onload = function() {
        document.body.style.opacity = '1';
    };
    
    // 地铁线路图缩放功能
    const subwayMap = document.getElementById('subwayMap');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetZoomBtn = document.getElementById('resetZoomBtn');
    
    let currentScale = 1;
    const maxScale = 3;
    const minScale = 0.3;
    const scaleStep = 0.2;
    
    // 点击放大按钮
    zoomInBtn.addEventListener('click', function() {
        if (currentScale < maxScale) {
            currentScale += scaleStep;
            updateMapScale();
        }
    });
    
    // 点击缩小按钮
    zoomOutBtn.addEventListener('click', function() {
        if (currentScale > minScale) {
            currentScale -= scaleStep;
            updateMapScale();
        }
    });
    
    // 点击重置按钮
    resetZoomBtn.addEventListener('click', function() {
        currentScale = 1;
        updateMapScale();
    });
    
    // 更新地图缩放比例
    function updateMapScale() {
        subwayMap.style.transform = `scale(${currentScale})`;
        subwayMap.style.transition = 'transform 0.3s ease';
        
        // 添加缩放指示器
        const zoomLevel = Math.round(currentScale * 100) + '%';
        
        // 更新按钮状态
        zoomInBtn.disabled = currentScale >= maxScale;
        zoomOutBtn.disabled = currentScale <= minScale;
        
        // 添加缩放级别提示
        if (!document.querySelector('.zoom-level')) {
            const zoomLevelDiv = document.createElement('div');
            zoomLevelDiv.className = 'zoom-level';
            zoomLevelDiv.textContent = zoomLevel;
            zoomLevelDiv.style.cssText = `
                position: absolute;
                top: 25px;
                left: 25px;
                background: rgba(0, 0, 0, 0.7);
                color: #4fc3f7;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                border: 1px solid rgba(79, 195, 247, 0.3);
            `;
            document.querySelector('.map-wrapper').appendChild(zoomLevelDiv);
        } else {
            document.querySelector('.zoom-level').textContent = zoomLevel;
        }
    }
    
    // 鼠标滚轮缩放地图
    subwayMap.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
            // 向上滚动，放大
            if (currentScale < maxScale) {
                currentScale += scaleStep;
            }
        } else {
            // 向下滚动，缩小
            if (currentScale > minScale) {
                currentScale -= scaleStep;
            }
        }
        
        updateMapScale();
    });
    
    // 双击重置缩放
    subwayMap.addEventListener('dblclick', function() {
        currentScale = 1;
        updateMapScale();
    });
    
    // 页面滚动动画
    const transportSections = document.querySelectorAll('.transport-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为每个部分添加初始样式并开始观察
    transportSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // 地铁线路点击效果
    const lineNumbers = document.querySelectorAll('.line-number');
    
    lineNumbers.forEach(line => {
        line.addEventListener('click', function() {
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 显示线路详情
            const lineName = this.textContent;
            const lineDescriptions = {
                '1号线': '贯穿南宁东西向主干线，连接石埠和火车东站',
                '2号线': '连接西津和坛泽，是南北向重要线路',
                '3号线': '连接科园大道和平良立交，服务高新区',
                '4号线': '连接洪运路和楞塘村，服务五象新区',
                '5号线': '连接国凯大道和金桥客运站，是全自动无人驾驶线路'
            };
            
            // 创建或更新详情提示
            let tooltip = document.querySelector('.line-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'line-tooltip';
                tooltip.style.cssText = `
                    position: fixed;
                    background: rgba(20, 25, 35, 0.95);
                    color: #e3f2fd;
                    padding: 15px 20px;
                    border-radius: 10px;
                    border: 1px solid rgba(79, 195, 247, 0.3);
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
                    z-index: 1000;
                    max-width: 300px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    backdrop-filter: blur(5px);
                    transition: all 0.3s ease;
                `;
                document.body.appendChild(tooltip);
            }
            
            tooltip.innerHTML = `
                <strong>${lineName}</strong><br>
                ${lineDescriptions[lineName] || '线路详细信息'}
            `;
            
            // 定位提示框
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 10) + 'px';
            
            // 3秒后隐藏
            setTimeout(() => {
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (tooltip && tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                    }, 300);
                }
            }, 3000);
        });
    });
    
    // 高铁站卡片悬停效果
    const stationCards = document.querySelectorAll('.station-card');
    
    stationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // 导航栏响应式菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // 滚动到顶部按钮
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(25, 118, 210, 0.9);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.background = 'rgba(33, 150, 243, 0.95)';
        scrollTopBtn.style.transform = 'translateY(-3px)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.background = 'rgba(25, 118, 210, 0.9)';
        scrollTopBtn.style.transform = '';
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
});