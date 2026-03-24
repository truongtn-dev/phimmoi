import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useCommentsContext } from '../context/CommentsContext';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import * as Icons from '../components/ui/icons';

export default function AdminCommentsScreen() {
  const { allComments, deleteComment } = useCommentsContext();

  // Flatten the comments
  const commentsList = [];
  Object.keys(allComments).forEach((slug) => {
    allComments[slug].forEach((c) => {
      commentsList.push({ ...c, slug });
    });
  });

  commentsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(item.user?.[0] || 'U').toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.user}>{item.user}</Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('vi-VN')} • {item.slug}</Text>
        </View>
        <Pressable onPress={() => deleteComment(item.slug, item.id)} style={styles.deleteBtn}>
          <Icons.Trash2 size={20} color="#FF6B6B" />
        </Pressable>
      </View>
      <Text style={styles.body}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {commentsList.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Icons.MessageSquare size={64} color={COLORS.border} />
          <Text style={styles.emptyText}>Chưa có bình luận nào</Text>
        </View>
      ) : (
        <FlatList
          data={commentsList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: SPACING.lg }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: FONT.md, marginTop: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: FONT.sm },
  user: { color: COLORS.textPrimary, fontSize: FONT.sm, fontWeight: '700' },
  time: { color: COLORS.textMuted, fontSize: FONT.xs, marginTop: 2 },
  deleteBtn: { padding: 8 },
  body: { color: COLORS.textSecondary, fontSize: FONT.sm, lineHeight: 20 },
});
