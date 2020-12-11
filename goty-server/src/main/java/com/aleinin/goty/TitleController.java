package com.aleinin.goty;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
class TitleController {

    private final TitleService titleService;

    @GetMapping("/titles")
    List<String> titles(@RequestParam String word, @RequestParam(defaultValue = "5") int count) {
        return titleService.search(word, count);
    }
}
