// 检查localStorage中的收藏数据
console.log('=== 检查收藏数据 ===');

// 获取收藏数据
const storedFavorites = localStorage.getItem('favorites');
if (storedFavorites) {
  try {
    const favorites = JSON.parse(storedFavorites);
    console.log('收藏数据数量:', favorites.length);
    console.log('收藏数据详情:', favorites);
    
    // 检查每个收藏项目是否在newHomeProjects中
    if (typeof newHomeProjects !== 'undefined') {
      console.log('\n=== 检查项目匹配 ===');
      console.log('newHomeProjects数量:', newHomeProjects.length);
      
      favorites.forEach((favorite, index) => {
        const project = newHomeProjects.find((p) => p.id === favorite.projectId);
        if (project) {
          console.log(`收藏 ${index + 1}: 找到项目 - ${project.name} (ID: ${project.id})`);
        } else {
          console.log(`收藏 ${index + 1}: 未找到项目 - ID: ${favorite.projectId}`);
        }
      });
    } else {
      console.log('newHomeProjects未定义，无法检查匹配');
    }
  } catch (e) {
    console.error('解析收藏数据失败:', e);
  }
} else {
  console.log('localStorage中无收藏数据');
}

console.log('\n=== 检查完成 ===');