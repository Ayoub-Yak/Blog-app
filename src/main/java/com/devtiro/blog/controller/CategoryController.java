package com.devtiro.blog.controller;


import com.devtiro.blog.domain.dtos.CategoryDto;
import com.devtiro.blog.domain.dtos.CreateCategoryRequest;
import com.devtiro.blog.domain.entities.Category;
import com.devtiro.blog.mappers.CategoryMapper;
import com.devtiro.blog.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;



    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories(){
        List<CategoryDto> categories = categoryService.getAllCategories().stream()
                .map(categoryMapper::toCategoryDto)
                .toList();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(
            @RequestBody
            @Valid
            CreateCategoryRequest request){
        Category categoryToCreate = categoryMapper.toCategory(request);
        Category createdCategory = categoryService.createCategory(categoryToCreate);
        return new ResponseEntity<>(categoryMapper.toCategoryDto(createdCategory), HttpStatus.CREATED);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deteleCategory(@PathVariable UUID id){
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

}
