// main.js - 主应用逻辑
document.addEventListener('DOMContentLoaded', async () => {
    // 根据当前页面加载不同功能
    if (document.getElementById('postsList')) {
        await loadPostsList();
    } else if (document.getElementById('postDetail')) {
        await loadPostDetail();
    }
});

// 加载文章列表
async function loadPostsList() {
    const postsList = document.getElementById('postsList');
    const posts = await API.getPosts();
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p>暂无文章</p>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <article class="post-card">
            <h2 class="post-title">${escapeHTML(post.title)}</h2>
            <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
            <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
            <a href="post.html?id=${post.id}" class="read-more">阅读更多</a>
        </article>
    `).join('');
}

// 加载文章详情
async function loadPostDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = '/';
        return;
    }
    
    const post = await API.getPost(postId);
    if (!post) {
        window.location.href = '/';
        return;
    }
    
    // 渲染文章内容
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postDate').textContent = new Date(post.date).toLocaleDateString();
    document.getElementById('postContent').innerHTML = escapeHTML(post.content);
    
    // 渲染评论
    renderComments(post.comments || []);
    
    // 评论表单提交
    document.getElementById('commentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const comment = {
            author: formData.get('author'),
            content: formData.get('content')
        };
        
        if (!comment.content) {
            alert('评论内容不能为空');
            return;
        }
        
        const updatedPost = await API.addComment(postId, comment);
        if (updatedPost) {
            renderComments(updatedPost.comments);
            e.target.reset();
        }
    });
}

// 渲染评论列表
function renderComments(comments) {
    const commentsContainer = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>暂无评论</p>';
        return;
    }
    
    commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment">
            <h4>${escapeHTML(comment.author)}</h4>
            <p class="comment-date">${new Date(comment.date).toLocaleString()}</p>
            <p>${escapeHTML(comment.content)}</p>
        </div>
    `).join('');
}

// XSS防护 - 转义HTML
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}