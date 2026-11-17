package com.devtiro.blog.services.impl;

import com.devtiro.blog.domain.CreatePostRequest;
import com.devtiro.blog.domain.PostStatus;
import com.devtiro.blog.domain.UpdatePostRequest;
import com.devtiro.blog.domain.entities.Category;
import com.devtiro.blog.domain.entities.Post;
import com.devtiro.blog.domain.entities.Tag;
import com.devtiro.blog.domain.entities.User;
import com.devtiro.blog.repository.PostRepository;
import com.devtiro.blog.services.CategoryService;
import com.devtiro.blog.services.PostService;
import com.devtiro.blog.services.TagService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;

    private static final int WORDS_PER_MINUTE = 200;


    @Override
    public Post getPost(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {
        if (categoryId != null && tagId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByStatusAndCategoryAndTagsContaining(
                    PostStatus.PUBLISHED,
                    category,
                    tag
            );
        }
        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            return postRepository.findAllByStatusAndCategory(
                    PostStatus.PUBLISHED,
                    category
            );
        }
        if (tagId != null) {
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByStatusAndTagsContaining(
                    PostStatus.PUBLISHED,
                    tag
            );
        }

        return postRepository.findAllByStatus(PostStatus.PUBLISHED);
    }

    @Override
    public List<Post> getDraftPosts(User user) {
        return
        postRepository.findAllByAuthorAndStatus(user,PostStatus.DRAFT);
    }

    @Override
    @Transactional
    public Post createPost(User user, CreatePostRequest request) {
        Post newpost = new Post();
        newpost.setTitle(request.getTitle());
        newpost.setContent(request.getContent());
        newpost.setAuthor(user);
        newpost.setStatus(request.getStatus());
        newpost.setReadingTime(calculateReadingTime(request.getContent()));
        Category category = categoryService.getCategoryById(request.getCategoryId());
        newpost.setCategory(category);
        Set<UUID> tagIds = request.getTagIds();
        List<Tag> tags = tagService.getTagsByIds(tagIds);
        newpost.setTags(new HashSet<>(tags));

        return postRepository.save(newpost);
    }

    @Override
    @Transactional
    public Post updatePost(UUID id, UpdatePostRequest request) {
        Post existingPost =
        postRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Post not found with id: " + id));
        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        existingPost.setStatus(request.getStatus());
        existingPost.setReadingTime(calculateReadingTime(request.getContent()));

         UUID updatePostResquestCategoryId = request.getCategoryId();
         if (!existingPost.getCategory().getId().equals(updatePostResquestCategoryId)){
             Category newCategory = categoryService.getCategoryById(updatePostResquestCategoryId);
             existingPost.setCategory(newCategory);
         }
         Set<UUID> existingTagIds =
         existingPost.getTags().stream().map(Tag::getId).collect(Collectors.toSet());
         Set<UUID> updatePostResquestTagIds = request.getTagIds();
         if (!existingTagIds.equals(updatePostResquestTagIds)){
             List<Tag> newTags = tagService.getTagsByIds(updatePostResquestTagIds);
             existingPost.setTags(new HashSet<>(newTags));
         }

        return postRepository.save(existingPost);
    }

    @Override
    public void deletePost(UUID id) {
        Post post = getPost(id);
        postRepository.delete(post);
    }

    private Integer calculateReadingTime(String content){
        if (content ==null || content.isEmpty()){
            return 0;
        }
        int wordCount = content.trim().split("\\s+").length;
        return (int)Math.ceil((double) wordCount / WORDS_PER_MINUTE);
    }
}
