import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateBookDto } from './dto/update-book.dto'; // Import et

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 🔒 KİTAP EKLEME (Sadece Giriş Yapanlar)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookDto: CreateBookDto, @Req() req) {
    return this.bookService.create(createBookDto, req.user);
  }

  // 🌍 TÜM KİTAPLARI LİSTELE (Herkese Açık - Guard Yok)
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  // 🌍 TEK KİTAP DETAYI (Herkese Açık - Guard Yok)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookService.findOne(+id);
    if (!book) {
      throw new NotFoundException('Aradığınız kitap bulunamadı.');
    }
    return book;
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }
  // 🗑️ SİLME (Sadece Giriş Yapanlar)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
