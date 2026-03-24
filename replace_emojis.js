const fs = require('fs');
const path = require('path');

function processFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep[0], rep[1]);
    });
    
    // Add import * as Icons from '../components/ui/icons'; if not exists
    if (content !== original && !content.includes("import * as Icons")) {
        content = content.replace(/(import .*?;)/g, (match, p1, offset, string) => {
             const nextImport = string.indexOf("import", offset + match.length);
             if (nextImport === -1 || nextImport > offset + 200) {
                 return match + "\nimport * as Icons from '../components/ui/icons';";
             }
             return match;
        });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. ProfileScreen.js
processFile(path.join(__dirname, 'screens', 'ProfileScreen.js'), [
   ["{ icon: '❤️', label: `Phim yêu thích", "{ icon: <Icons.Heart size={20} color=\"#E50914\" />, label: `Phim yêu thích"],
   ["{ icon: '🕐', label: 'Lịch sử xem'", "{ icon: <Icons.Clock size={20} color=\"#F5C518\" />, label: 'Lịch sử xem'"],
   ["{ icon: '⚠️', label: 'Báo cáo lỗi phim'", "{ icon: <Icons.AlertTriangle size={20} color=\"#FF6B6B\" />, label: 'Báo cáo lỗi phim'"],
   ["{ icon: '🛡️', label: 'Quản trị viên'", "{ icon: <Icons.Shield size={20} color=\"#1E90FF\" />, label: 'Quản trị viên'"],
   ["{item.icon}", "{item.icon}"], // already object
   ["<Text style={styles.logoutText}>🚪 Đăng xuất</Text>", "<View style={{flexDirection:'row',alignItems:'center'}}><Icons.LogOut size={20} color=\"#FF6B6B\" style={{marginRight:8}}/><Text style={[styles.logoutText,{marginLeft:0}]}>Đăng xuất</Text></View>"]
]);

// 2. MovieDetailScreen.js
processFile(path.join(__dirname, 'screens', 'MovieDetailScreen.js'), [
   ["{genres ? <Text style={styles.genres}>🎭 {genres}</Text> : null}", "{genres ? <View style={{flexDirection:'row',alignItems:'center',marginRight:16}}><Icons.Tag size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genres}>{genres}</Text></View> : null}"],
   ["{countries ? <Text style={styles.genres}>🌍 {countries}</Text> : null}", "{countries ? <View style={{flexDirection:'row',alignItems:'center'}}><Icons.Globe size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genres}>{countries}</Text></View> : null}"],
   ["<Text style={styles.iconBtnText}>{fav ? '❤️' : '🤍'}</Text>", "<View style={styles.iconBtnText}>{fav ? <Icons.Heart size={24} color=\"#E50914\" /> : <Icons.EmptyHeart size={24} color=\"#fff\" />}</View>"],
   ["<Text style={styles.iconBtnText}>⚠️</Text>", "<View style={styles.iconBtnText}><Icons.AlertTriangle size={24} color=\"#FF6B6B\" /></View>"],
   ["<Text style={styles.sectionTitle}>💬 Bình luận ({comments.length})</Text>", "<View style={{flexDirection:'row',alignItems:'center',marginBottom:SPACING.md}}><Icons.MessageSquare size={20} color={COLORS.textPrimary} style={{marginRight:8}}/><Text style={[styles.sectionTitle,{marginBottom:0}]}>Bình luận ({comments.length})</Text></View>"],
   ["<Text style={styles.commentDelete}>🗑️</Text>", "<View style={styles.commentDelete}><Icons.Trash2 size={16} color=\"#FF6B6B\" /></View>"],
   ["<Text style={styles.modalTitle}>⚠️ Báo cáo phim</Text>", "<View style={{flexDirection:'row',alignItems:'center',marginBottom:SPACING.md,justifyContent:'center'}}><Icons.AlertTriangle size={24} color=\"#FF6B6B\" style={{marginRight:8}}/><Text style={[styles.modalTitle,{marginBottom:0}]}>Báo cáo phim</Text></View>"]
]);

// 3. SearchScreen.js
processFile(path.join(__dirname, 'screens', 'SearchScreen.js'), [
   ["<Text style={styles.searchIcon}>🔍</Text>", "<View style={styles.searchIcon}><Icons.Search size={18} color={COLORS.textMuted} /></View>"],
   ["<Text style={styles.emptyIcon}>🎬</Text>", "<View style={{marginBottom:SPACING.md}}><Icons.Film size={48} color={COLORS.border} /></View>"]
]);

// 4. WatchHistoryScreen.js
processFile(path.join(__dirname, 'screens', 'WatchHistoryScreen.js'), [
   ["<Text style={styles.emptyIcon}>🕐</Text>", "<View style={{marginBottom:SPACING.md}}><Icons.Clock size={48} color={COLORS.border} /></View>"]
]);

// 5. WatchScreen.js
processFile(path.join(__dirname, 'screens', 'WatchScreen.js'), [
   ["<Text style={styles.placeholderIcon}>🎬</Text>", "<View style={styles.placeholderIcon}><Icons.Film size={48} color={COLORS.border} /></View>"],
   ["{genres ? <Text style={styles.genresText}>🎭 {genres}</Text> : null}", "{genres ? <View style={{flexDirection:'row',alignItems:'center'}}><Icons.Tag size={16} color={COLORS.textSecondary} style={{marginRight:6}} /><Text style={styles.genresText}>{genres}</Text></View> : null}"],
   ["title=\"📺 Phim Đề Xuất\"", "title=\"Phim Đề Xuất\" icon={<Icons.Monitor size={20} color=\"#1E90FF\" />}"]
]);

// 6. AppNavigator.js
processFile(path.join(__dirname, 'navigation', 'AppNavigator.js'), [
   [
     "const TabIcon = ({ icon, label, focused }) => (",
     "const TabIcon = ({ IconComponent, label, focused }) => ("
   ],
   [
     "<Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>",
     "<IconComponent size={22} color={focused ? COLORS.primary : COLORS.textMuted} />"
   ],
   ["<TabIcon icon=\"🏠\"", "<TabIcon IconComponent={Icons.HomeIcon}"],
   ["<TabIcon icon=\"🔍\"", "<TabIcon IconComponent={Icons.Search}"],
   ["<TabIcon icon=\"❤️\"", "<TabIcon IconComponent={Icons.Heart}"],
   ["<TabIcon icon=\"👤\"", "<TabIcon IconComponent={Icons.User}"]
]);
