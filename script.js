// 工具函数：节流处理（限制高频事件触发频率）
function throttle(fn, delay = 100) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}

// 缓存DOM元素（减少重复查询）
const DOM = {
    menuToggle: document.querySelector('.menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    navbar: document.querySelector('.navbar'),
    exploreBtn: document.querySelector('.cta-button[href="#explore"]'),
    cityView: document.querySelector('.city-view'),
    fixedBg: document.querySelector('.fixed-bg'),
    dynamicIntro: document.querySelector('.dynamic-intro'),
    cards: document.querySelectorAll('.feature-card, .attraction-card, .food-card'),
    navLinksA: document.querySelectorAll('.nav-links a'),
    subtitleChars: document.querySelectorAll('.subtitle-char'),
    textWords: document.querySelectorAll('.text-word'),
    titleLines: document.querySelectorAll('.title-line')
};

// 初始化卡片样式
function initCards() {
    DOM.cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
    });
}

// 使用IntersectionObserver监测卡片可见性（替代scroll事件检查）
function initCardObserver() {
    if (!DOM.cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 延迟触发，保持原有 stagger 效果
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target); // 只触发一次
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px', // 提前100px触发
        threshold: 0.1
    });

    DOM.cards.forEach(card => observer.observe(card));
}

// 鼠标移动视差效果（节流处理）
const handleMouseMove = throttle(function(e) {
    if (!DOM.fixedBg) return;
    
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    const moveX = (mouseX - 0.5) * 20;
    const moveY = (mouseY - 0.5) * 20;
    
    // 使用requestAnimationFrame确保渲染时机
    requestAnimationFrame(() => {
        DOM.fixedBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
    });
}, 60); // 约16fps，视觉效果足够且性能更好

// 动态文字区域观察器
function initDynamicTextObserver() {
    if (!DOM.dynamicIntro) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                DOM.dynamicIntro.classList.add('active');
                
                // 字符动画
                DOM.subtitleChars.forEach((char, index) => {
                    setTimeout(() => {
                        char.style.transform = 'translateY(0) rotateY(0)';
                        char.style.opacity = '1';
                    }, 100 * (index + 1));
                });
                
                // 文字逐个显示
                DOM.textWords.forEach((word, index) => {
                    setTimeout(() => {
                        word.style.transform = 'translateY(0)';
                        word.style.opacity = '0.8';
                    }, 20 * (index + 1));
                });
                
                observer.unobserve(DOM.dynamicIntro);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(DOM.dynamicIntro);
}

// 绑定文字交互效果（事件委托优化）
function bindTextEffects() {
    // 文字鼠标效果（事件委托到父元素）
    if (DOM.textWords.length && DOM.textWords[0].parentElement) {
        const textContainer = DOM.textWords[0].parentElement;
        textContainer.addEventListener('mouseenter', function(e) {
            const word = e.target.closest('.text-word');
            if (!word) return;
            
            word.style.transform = 'translateY(-2px) scale(1.05)';
            word.style.color = '#2ecc71';
            word.style.textShadow = '0 5px 15px rgba(46, 204, 113, 0.5)';
            word.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.3)';
            word.style.padding = '0 2px';
            word.style.borderRadius = '3px';

            setTimeout(() => {
                const prev = word.previousElementSibling;
                const next = word.nextElementSibling;
                
                if (prev?.classList.contains('text-word')) {
                    prev.style.transform = 'translateY(-1px)';
                    prev.style.color = '#27ae60';
                }
                if (next?.classList.contains('text-word')) {
                    next.style.transform = 'translateY(-1px)';
                    next.style.color = '#27ae60';
                }
            }, 50);
        });

        textContainer.addEventListener('mouseleave', function(e) {
            const word = e.target.closest('.text-word');
            if (!word) return;
            
            word.style.transform = 'translateY(0) scale(1)';
            word.style.color = '';
            word.style.textShadow = '';
            word.style.boxShadow = '';
            word.style.padding = '0';
            word.style.borderRadius = '0';

            const prev = word.previousElementSibling;
            const next = word.nextElementSibling;
            
            if (prev?.classList.contains('text-word')) {
                prev.style.transform = '';
                prev.style.color = '';
            }
            if (next?.classList.contains('text-word')) {
                next.style.transform = '';
                next.style.color = '';
            }
        });
    }

    // 标题鼠标效果
    DOM.titleLines.forEach(line => {
        line.addEventListener('mouseenter', () => {
            line.style.animation = 'pulse 1s infinite alternate';
            line.style.cursor = 'pointer';
        });
        line.addEventListener('mouseleave', () => {
            line.style.animation = '';
        });
    });
}

// 初始化导航功能
function initNavigation() {
    // 菜单切换
    if (DOM.menuToggle && DOM.navLinks) {
        DOM.menuToggle.addEventListener('click', () => {
            DOM.navLinks.classList.toggle('active');
            DOM.menuToggle.classList.toggle('active');
        });
    }

    // 移动端菜单关闭
    DOM.navLinksA.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && DOM.navLinks && DOM.menuToggle) {
                DOM.navLinks.classList.remove('active');
                DOM.menuToggle.classList.remove('active');
            }
        });
    });

    // 平滑滚动
    if (DOM.exploreBtn && DOM.cityView) {
        DOM.exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: DOM.cityView.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    }

    // 窗口大小调整
    window.addEventListener('resize', throttle(() => {
        if (window.innerWidth > 768 && DOM.navLinks && DOM.menuToggle) {
            DOM.navLinks.classList.remove('active');
            DOM.menuToggle.classList.remove('active');
        }
    }, 100));
}

// 添加粒子动画样式
function addParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); text-shadow: 0 0 5px rgba(46, 204, 113, 0.5); }
            100% { transform: scale(1.1); text-shadow: 0 0 20px rgba(46, 204, 113, 0.8); }
        }
    `;
    document.head.appendChild(style);
}

// 页面加载动画
function initLoadAnimation() {
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化顺序优化
    addParticleStyles();
    initLoadAnimation();
    initCards();
    initCardObserver();
    initNavigation();
    initDynamicTextObserver();
    bindTextEffects();

    // 绑定高频事件（带节流）
    window.addEventListener('scroll', handleNavbarScroll);
    document.addEventListener('mousemove', handleMouseMove);
});