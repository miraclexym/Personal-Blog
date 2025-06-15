// api.js - 模拟后端API
const API = {
    // 获取所有文章
    getPosts: async () => {
        // 实际项目中这里会是fetch真实API
        // 这里我们使用本地存储或模拟数据
        try {
            const response = await fetch('data/posts.json');
            return await response.json();
        } catch (error) {
            console.error('获取文章失败:', error);
            // 如果文件加载失败，使用默认数据
            return [
                {
                    id: 1,
                    title: 'ES6新特性介绍',
                    excerpt: '本文将介绍ES6中最常用的新特性...',
                    content: '...完整文章内容...',
                    date: '2023-05-15',
                    comments: []
                },
                {
                    id: 2,
                    title: 'CSS Grid布局指南',
                    excerpt: '学习如何使用CSS Grid创建复杂的布局...',
                    content: '...完整文章内容...',
                    date: '2023-05-10',
                    comments: []
                }
            ];
        }
    },
    
    // 获取单篇文章
    getPost: async (id) => {
        const posts = await API.getPosts();
        return posts.find(post => post.id === parseInt(id));
    },
    
    // 添加评论
    addComment: async (postId, comment) => {
        // 在实际应用中，这里会发送到服务器
        // 这里我们模拟存储到localStorage
        const posts = await API.getPosts();
        const post = posts.find(p => p.id === parseInt(postId));
        
        if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push({
                id: Date.now(), // 简单ID生成
                author: comment.author || '匿名',
                content: comment.content,
                date: new Date().toISOString()
            });
            
            // 模拟"保存"到"服务器"
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            return post;
        }
        
        return null;
    }
};