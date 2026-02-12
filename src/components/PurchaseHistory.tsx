/**
 * 购房历程组件
 * 类似小红书方式的帖子交互，支持用户发布图文以及视频帖子
 */

import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, User, Image, Video, Plus, Search, X, Send } from 'lucide-react';

// 帖子类型
interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: number;
  comments: Comment[];
  shares: number;
  saved: boolean;
  createdAt: string;
  tags: string[];
}

// 评论类型
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

// 用户类型
interface User {
  id: string;
  name: string;
  avatar: string;
}

// 模拟用户数据
const CURRENT_USER: User = {
  id: 'user1',
  name: '我',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly%20face&image_size=square'
};

// 模拟帖子数据
const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    userId: 'user2',
    userName: '上海买房小白',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20man%20avatar%20friendly%20smile&image_size=square',
    content: '终于在上海买到了心仪的房子！分享一下我的购房历程，希望能帮到正在买房的朋友们。从看房到签约，前后花了6个月时间，踩了不少坑，也学到了很多知识。',
    media: [
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20living%20room%20bright%20spacious&image_size=landscape_16_9'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=apartment%20kitchen%20modern%20design%20white%20cabinets&image_size=landscape_16_9'
      }
    ],
    likes: 156,
    comments: [
      {
        id: 'comment1',
        userId: 'user3',
        userName: '买房路上',
        userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20avatar%20professional%20look&image_size=square',
        content: '恭喜！请问是哪个区域的房子呀？',
        likes: 8,
        createdAt: '2026-01-20T10:30:00Z'
      },
      {
        id: 'comment2',
        userId: 'user2',
        userName: '上海买房小白',
        userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20man%20avatar%20friendly%20smile&image_size=square',
        content: '谢谢！是浦东新区的，靠近地铁口，交通很方便。',
        likes: 5,
        createdAt: '2026-01-20T11:15:00Z'
      }
    ],
    shares: 23,
    saved: false,
    createdAt: '2026-01-20T09:00:00Z',
    tags: ['首套房', '浦东新区', '购房经验']
  },
  {
    id: 'post2',
    userId: 'user3',
    userName: '房产达人',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20realtor%20avatar%20confident%20expression&image_size=square',
    content: '分享一个贷款小技巧：如果你的公积金余额足够，可以考虑组合贷款，这样能节省不少利息。另外，贷款年限选择也很重要，建议根据自己的还款能力来决定。',
    media: [
      {
        type: 'video',
        url: 'https://example.com/video.mp4'
      }
    ],
    likes: 234,
    comments: [
      {
        id: 'comment3',
        userId: 'user4',
        userName: '准备买房',
        userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20couple%20avatar%20happy%20expression&image_size=square',
        content: '请问组合贷款的流程复杂吗？',
        likes: 12,
        createdAt: '2026-01-19T14:20:00Z'
      }
    ],
    shares: 45,
    saved: true,
    createdAt: '2026-01-19T13:00:00Z',
    tags: ['贷款技巧', '公积金贷款', '购房指南']
  },
  {
    id: 'post3',
    userId: 'user4',
    userName: '装修日记',
    userAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20designer%20avatar%20artistic%20style&image_size=square',
    content: '记录一下我的装修过程，从毛坯到成品，每一步都充满了挑战和惊喜。建议大家在装修前一定要做好预算和规划，避免不必要的开支。',
    media: [
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=apartment%20renovation%20before%20and%20after%20comparison&image_size=landscape_16_9'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bedroom%20design%20modern%20minimalist%20style&image_size=landscape_16_9'
      },
      {
        type: 'image',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bathroom%20remodel%20luxury%20design&image_size=landscape_16_9'
      }
    ],
    likes: 312,
    comments: [],
    shares: 67,
    saved: false,
    createdAt: '2026-01-18T16:45:00Z',
    tags: ['装修日记', '装修技巧', '家居设计']
  }
];

interface PurchaseHistoryProps {
  onNavigate: (view: string) => void;
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ onNavigate }) => {
  // 状态管理
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    media: [] as { type: 'image' | 'video'; url: string }[],
    tags: [] as string[]
  });
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 搜索功能
  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  // 处理点赞
  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
  };

  // 处理保存
  const handleSave = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, saved: !post.saved } 
          : post
      )
    );
  };

  // 处理评论
  const handleComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `comment${Date.now()}`,
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatar,
      content,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] } 
          : post
      )
    );

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // 处理创建帖子
  const handleCreatePost = () => {
    if (!newPost.content.trim() && newPost.media.length === 0) return;

    const newPostData: Post = {
      id: `post${Date.now()}`,
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatar,
      content: newPost.content,
      media: newPost.media,
      likes: 0,
      comments: [],
      shares: 0,
      saved: false,
      createdAt: new Date().toISOString(),
      tags: newPost.tags
    };

    setPosts(prevPosts => [newPostData, ...prevPosts]);
    setShowCreatePost(false);
    setNewPost({
      content: '',
      media: [],
      tags: []
    });
  };

  // 处理添加媒体
  const handleAddMedia = (type: 'image' | 'video') => {
    // 模拟添加媒体
    const mockUrl = type === 'image' 
      ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=real%20estate%20property%20photo&image_size=landscape_16_9'
      : 'https://example.com/video.mp4';

    setNewPost(prev => ({
      ...prev,
      media: [...prev.media, { type, url: mockUrl }]
    }));
  };

  // 处理删除媒体
  const handleRemoveMedia = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '刚刚';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分钟前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小时前`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* 标题区域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">购房历程</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>发布帖子</span>
            </button>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索帖子、用户或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 帖子列表 */}
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* 帖子头部 */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{post.userName}</h3>
                    <p className="text-xs text-gray-400">{formatTime(post.createdAt)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* 帖子内容 */}
              <div className="px-4 mb-4">
                <p className="text-white mb-4">{post.content}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 帖子媒体 */}
              {post.media.length > 0 && (
                <div className={`grid ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 px-4 mb-4`}>
                  {post.media.map((media, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Video className="w-12 h-12 text-white/70" />
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            视频
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 帖子互动 */}
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleSave(post.id)}
                    className={`text-gray-400 ${post.saved ? 'text-blue-500' : 'hover:text-white'} transition-colors`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                {/* 评论 */}
                {post.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {post.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">{comment.userName}</span>
                            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-1">{comment.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <button className="hover:text-white">点赞 {comment.likes}</button>
                            <button className="hover:text-white">回复</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {post.comments.length > 2 && (
                      <button className="text-sm text-gray-400 hover:text-white">
                        查看全部 {post.comments.length} 条评论
                      </button>
                    )}
                  </div>
                )}

                {/* 评论输入 */}
                <div className="flex items-center gap-3">
                  <img
                    src={CURRENT_USER.avatar}
                    alt={CURRENT_USER.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="写下你的评论..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                    <button
                      onClick={() => handleComment(post.id, commentInputs[post.id] || '')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 空状态 */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">未找到相关帖子</p>
            </div>
          )}
        </div>
      </div>

      {/* 创建帖子模态框 */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">发布帖子</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-6">
              {/* 用户信息 */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-white font-medium">{CURRENT_USER.name}</span>
              </div>

              {/* 内容输入 */}
              <textarea
                placeholder="分享你的购房历程..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="w-full min-h-[120px] px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
              />

              {/* 媒体预览 */}
              {newPost.media.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4 mb-4">
                  {newPost.media.map((media, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white/70" />
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 添加媒体按钮 */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => handleAddMedia('image')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span>添加图片</span>
                </button>
                <button
                  onClick={() => handleAddMedia('video')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>添加视频</span>
                </button>
              </div>

              {/* 标签输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">添加标签</label>
                <input
                  type="text"
                  placeholder="输入标签，用空格分隔..."
                  onChange={(e) => {
                    const tags = e.target.value.split(' ').filter(tag => tag.trim());
                    setNewPost(prev => ({ ...prev, tags }));
                  }}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>

              {/* 标签预览 */}
              {newPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {newPost.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 模态框底部 */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreatePost}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;