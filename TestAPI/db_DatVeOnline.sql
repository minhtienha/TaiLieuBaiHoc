USE MASTER
GO

CREATE DATABASE DATVEONL
GO

USE DATVEONL
GO

/*==============================================================*/
/* Table: CHITIETDICHVU                                                  */
/*==============================================================*/
create table CHITIETDICHVU (
   MAVE                 varchar(255)         not null,
   MADICHVU             varchar(255)         not null,
   constraint PK_CHITIETDICHVU primary key (MAVE, MADICHVU)
)
go

/*==============================================================*/
/* Table: CHITIETSUAT                                               */
/*==============================================================*/
create table CHITIETSUAT (
   MAPHIM               varchar(255)         not null,
   MASUAT               varchar(255)         not null,
   GIOBATDAU            datetime             not null,
   GIOKETTHUC           datetime             not null,
   constraint PK_CHITIETSUAT primary key (MAPHIM, MASUAT)
)
go

alter table CHITIETSUAT
drop PK_CHITIETSUAT
go

--sửa cột GIOBATDAU và GIOKETTHUC kiểu dữ liệu time
alter table CHITIETSUAT
alter COLUMN GIOBATDAU TIME NOT NULL
alter table CHITIETSUAT
alter COLUMN GIOKETTHUC TIME NOT NULL
go

--bổ sung thêm khóa chính
alter table CHITIETSUAT
add constraint PK_CHITIETSUAT primary key (MAPHIM, MASUAT, GIOBATDAU) 
go

/*==============================================================*/
/* Table: CHITIETGHE                                               */
/*==============================================================*/
create table CHITIETGHE (
   MAGHE               varchar(255)          not null,
   MAVE                varchar(255)          not null,
   TRANGTHAI           nvarchar(MAX)         not null,
   GIOBATDAU           datetime              not null,
   GIOKETTHUC          datetime              not null,
   constraint PK_CHITIETGHE primary key (MAGHE, MAVE)
)
go

/*==============================================================*/
/* Table: DICHVU                                                */
/*==============================================================*/
create table DICHVU (
   MADICHVU             varchar(255)         not null,
   TENDICHVU            nvarchar(MAX)         not null,
   GIA                  int                  not null,
   MOTA                 nvarchar(MAX)         null,
   constraint PK_DICHVU primary key (MADICHVU)
)
go

/*==============================================================*/
/* Table: GHE                                                   */
/*==============================================================*/
create table GHE (
   MAGHE                varchar(255)         not null,
   MAVE                 varchar(255)         null,
   MALOAIGHE            varchar(255)         not null,
   MAPHONG              varchar(255)         not null,
   constraint PK_GHE primary key (MAGHE)
)
go

/*==============================================================*/
/* Table: KHACHHANG                                             */
/*==============================================================*/
create table KHACHHANG (
   MAKH                 varchar(255)         not null,
   TENKH                nvarchar(MAX)        null,
   EMAIL                varchar(255)         not null,
   SDT                  varchar(255)         not null,
   MATKHAU              varchar(255)         not null,
   NGAYDANGKY           datetime             null,
   constraint PK_KHACHHANG primary key (MAKH)
)
go

/*==============================================================*/
/* Table: LOAIGHE                                               */
/*==============================================================*/
create table LOAIGHE (
   MALOAIGHE            varchar(255)         not null,
   TENLOAIGHE           nvarchar(MAX)        not null,
   GIAGHE               int                  not null,
   constraint PK_LOAIGHE primary key (MALOAIGHE)
)
go

/*==============================================================*/
/* Table: PHIM                                                  */
/*==============================================================*/
create table PHIM (
   MAPHIM               varchar(255)         not null,
   TENPHIM              nvarchar(MAX)        not null,
   DAODIEN              nvarchar(MAX)         null,
   DIENVIEN             nvarchar(MAX)         null,
   THELOAI              nvarchar(MAX)         null,
   NGAYKHOICHIEU        datetime             not null,
   THOILUONG            int                  not null,
   MOTA                 nvarchar(MAX)        not null,
   POSTER               nvarchar(MAX)        not null,
   TRAILER              nvarchar(MAX)        not null,
   constraint PK_PHIM primary key (MAPHIM)
)
go

/*==============================================================*/
/* Table: PHONGCHIEU                                            */
/*==============================================================*/
create table PHONGCHIEU (
   MAPHONG              varchar(255)         not null,
   MARAP                varchar(255)         not null,
   TENPHONG             varchar(255)         null,
   SOGHE                int                  null,
   constraint PK_PHONGCHIEU primary key (MAPHONG)
)
go


/*==============================================================*/
/* Table: RAP                                                   */
/*==============================================================*/
create table RAP (
   MARAP                varchar(255)         not null,
   TENRAP               nvarchar(MAX)        null,
   DIACHI               nvarchar(MAX)        null,
   constraint PK_RAP primary key (MARAP)
)
--bổ sung cột tỉnh thành
ALTER TABLE RAP
ADD TINHTHANH NVARCHAR(MAX)
go


/*==============================================================*/
/* Table: SUATCHIEU                                             */
/*==============================================================*/
create table SUATCHIEU (
   MASUAT               varchar(255)         not null,
   MAPHONG              varchar(255)         not null,
   NGAYCHIEU            datetime             not null,
   constraint PK_SUATCHIEU primary key (MASUAT)
)
go

/*==============================================================*/
/* Table: VE                                                    */
/*==============================================================*/
create table VE (
   MAVE                 varchar(255)         not null,
   MASUAT               varchar(255)         not null,
   MAKH                 varchar(255)         not null,
   NGAYMUA              datetime             not null,
   GIAVE                int                  not null,
   constraint PK_VE primary key (MAVE)
)
go

alter table GHE
   add constraint FK_GHE_PHONGCHIU foreign key (MAPHONG)
      references PHONGCHIEU (MAPHONG)
go

alter table GHE
   add constraint FK_GHE_LOAIGHE foreign key (MALOAIGHE)
      references LOAIGHE (MALOAIGHE)
go

alter table PHONGCHIEU
   add constraint FK_PHONGCHIEU_RAP foreign key (MARAP)
      references RAP (MARAP)
go

alter table SUATCHIEU
   add constraint FK_SUATCHIEU_PHONGCHIEU foreign key (MAPHONG)
      references PHONGCHIEU (MAPHONG)
go

alter table VE
   add constraint FK_VE_SUATCHIEU foreign key (MASUAT)
      references SUATCHIEU (MASUAT)
go

alter table VE
   add constraint FK_VE_KHACHHANG foreign key (MAKH)
      references KHACHHANG (MAKH)
go

alter table CHITIETDICHVU
   add constraint FK_CHITIETDICHVU_VE foreign key (MAVE)
      references VE (MAVE)
go

alter table CHITIETDICHVU
   add constraint FK_CHITIETDICHVU_DICHVU foreign key (MADICHVU)
      references DICHVU (MADICHVU)
go

alter table CHITIETSUAT
   add constraint FK_CHITIETSUAT_PHIM foreign key (MAPHIM)
      references PHIM (MAPHIM)
go

alter table CHITIETSUAT
   add constraint FK_CHITIETSUAT_SUATCHIEU foreign key (MASUAT)
      references SUATCHIEU (MASUAT)
go

alter table CHITIETGHE
   add constraint FK_CHITIETGHE_VE foreign key (MAVE)
      references VE (MAVE)
go

alter table CHITIETGHE
   add constraint FK_CHITIETGHE_GHE foreign key (MAGHE)
      references GHE (MAGHE)
go

--thêm dữ liệu cho các bảng

--thêm bảng Phim
SET DATEFORMAT DMY
insert into PHIM values
('PHIM051120241', N'VENOM: KÈO CUỐI', N'Kelly Marcel', N'Tom Hardy, Juno Temple, Chiwetel Ejiofor', N'Hành Động', '25/10/2024', 109, N'Đây là phần phim cuối cùng và hoành tráng nhất về cặp đôi Venom và Eddie Brock (Tom Hardy). Sau khi dịch chuyển từ Vũ trụ Marvel trong ‘Spider-man: No way home’ (2021) trở về thực tại, Eddie Brock giờ đây cùng Venom sẽ phải đối mặt với ác thần Knull hùng mạnh - kẻ tạo ra cả chủng tộc Symbiote và những thế lực đang rình rập khác. Cặp đôi Eddie và Venom sẽ phải đưa ra lựa quyết định khốc liệt để hạ màn kèo cuối này.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/r/s/rsz_vnm3_intl_online_1080x1350_tsr_01.jpg', N'id1rfr_KZWg'),
('PHIM051120242', N'NGÀY XƯA CÓ MỘT CHUYỆN TÌNH', N'Trịnh Đình Lê Minh', N'Avin Lu, Ngọc Xuân, Đỗ Nhật Hoàng, Thanh Tú, Bảo Tiên, Hạo Khang', N'Tình cảm', '28/10/2024', 135, N'Ngày Xưa Có Một Chuyện Tình xoay quanh câu chuyện tình bạn, tình yêu giữa hai chàng trai và một cô gái từ thuở ấu thơ cho đến khi trưởng thành, phải đối mặt với những thử thách của số phận. Trải dài trong 4 giai đoạn từ năm 1987 - 2000, ba người bạn cùng tuổi - Vinh, Miền, Phúc đã cùng yêu, cùng bỡ ngỡ bước vào đời, va vấp và vượt qua.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/_/s/_size_chu_n_nxcmct_main-poster_dctr_1_.jpg', N'qaeHlk0OXec'),
('PHIM051120243', N'THẦN DƯỢC', N'Coralie Fargeat', N'Demi Moore, Margaret Qualley, Dennis Quaid', N'Kinh Dị', '01/11/2024', 139, N'Elizabeth Sparkle, minh tinh sở hữu vẻ đẹp hút hồn cùng với tài năng được mến mộ nồng nhiệt. Khi đã trải qua thời kỳ đỉnh cao, nhan sắc dần tàn phai, cô tìm đến những kẻ buôn lậu để mua một loại thuốc bí hiểm nhằm “thay da đổi vận", tạo ra một phiên bản trẻ trung hơn của chính mình.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/o/f/official_poster_the_substance.jpg', N'zBIDSp17AOo'),
('PHIM051120244', N'THIÊN ĐƯỜNG QUẢ BÁO', N'Boss Kuno', N'Jeff Satur, Engfa Waraha, Srida Puapimol, Harit Buayoi, Pongsakorn Mettarikanon', N'Hồi hộp, Tâm Lý', '01/11/2024', 131, N'Thongkam (Jeff Satur) và Sek (Pongsakorn) làm lụng vất vả, cày ngày cày đêm để xây dựng một mái ấm. Sau bao nỗ lực, cuối cùng họ cũng có quyền sở hữu trang trại sầu riêng ở Mae Hong Son. Tuy nhiên, bi kịch bỗng ập tới khi Sek đột ngột qua đời trong một vụ tai nạn vào thời điểm họ chưa kịp đăng ký kết hôn. Chính điều này đã khiến Thongkam không có quyền sở hữu tài sản mà 2 người đã cùng gây dựng. Ngôi nhà và đất đai bao gồm vườn sầu riêng đương nhiên thuộc về mẹ của Sek, người sẽ chuyển đến sống cùng con gái nuôi Mo (Engfa) và người làm vườn Jingna. Thongkam giờ phải đấu tranh để giành lại thành quả của tình yêu và công sức lao động của mình. Liệu giữa Thongkam và Mo, ai sẽ giành được quyền thừa kế , trở thành chủ vựa sầu riêng?', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-tdqb.jpg', N'P9Zoy3gtGlg'),
('PHIM051120245', N'TIẾNG GỌI CỦA OÁN HỒN', N'Takashi Shimizu', N'Nagisa Shibuya, Ikoi Hayase, Soma Santoki,…', N'Kinh Dị', '01/11/2024', 108, N'Năm 1992, một cô gái rơi từ mái của trường trung học cơ sở. Bên cạnh thi thể của cô ấy là một máy ghi âm cassette vẫn đang ghi lại... 32 năm sau, Honoka được thuê dạy các lớp học hè tại ngôi trường đó. Một ngày nọ, cô nghe thấy tiếng ngâm nga từ trên mái và một giọng nói hét lên: “Hãy lắng nghe âm thanh của tôi!” sau đó là tiếng rơi thịch của một học sinh. Honoka cùng các học sinh của mình, Hitomi và Takeru, bắt đầu nghi ngờ rằng hai vụ tai nạn này có liên quan đến nhau. Họ tìm trong kỷ yếu của năm 1992 và phát hiện bức ảnh của Sana, một bạn cùng lớp đam mê thu thập “âm thanh của mọi người” để viết bài hát của mình. Honoka, Hitomi, và Takeru nhanh chóng nhận ra rằng Sana chính là nguyên nhân của những vụ tai nạn, và bất cứ ai nghe bài hát của cô ấy đều có thể trở thành nạn nhân tiếp theo.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/s/a/sana_let_me_hear_main_poster_1_.jpg', N'Z6362SLEHXA'),
('PHIM051120246', N'VÙNG ĐẤT BỊ NGUYỀN RỦA', N'Panu Aree', N'Ananda Everingham, Bront Palarae, Jennis Oprasert, Firdaus Karim, Han Zalini, Seeda', N'Kinh Dị, Tâm Lý', '01/11/2024', 117, N'Sau cái chết của vợ, để trốn tránh quá khứ, Mit và cô con gái May chuyển đến một ngôi nhà mới ở khu phố ngoại ô. Trong lúc chuẩn bị xây dựng một miếu thờ thiên trước nhà mới, anh vô tình giải thoát một con quỷ đang giận dữ và ác mộng kinh hoàng ập tới cuộc sống mới của hai bố con. Mit tìm kiếm sự giúp đỡ của một thầy phù thủy để làm lễ trừ tà. Nhưng họ không biết rằng, lễ trừ tà cuối cùng sẽ mở ra nhiều bí mật đen tối về vùng đất này.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/2/x/2x3_1_.jpg', N'gBsdijgRpl4'),
('PHIM051120247', N'VÂY HÃM TẠI ĐÀI BẮC', N'George Huang', N'Luke Evans, Sung Kang, Gwei Lun-Mei', N'Hành Động, Hồi hộp', '01/11/2024', 100, N'Theo chân John Lawlor là một đặc vụ DEA cừ khôi bất khả chiến bại, anh sẽ không tiếc hi sinh bất cứ điều gì để hoàn thành nhiệm vụ được giao.Trong khi đó, Joey Kwang là "người vận chuyển" hàng đầu ở Đài Bắc với tốc độ không ai sánh bằng và tư duy nhạy bén mà không ai có thể theo kịp cô. Vô tình số phận đã đưa họ đến với nhau trước khi thế lực tội phạm chia cắt họ.15 năm sau, số phận một lần nữa đẩy Joey và John va chạm nhau trong tình cảnh bất đắc dĩ vào cuối tuần tại Đài Bắc. Và cả hai sẽ khám phá ra rằng điều duy nhất khó hơn việc yêu… chính là yêu lại.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/v/_/v_y_h_m_t_i_i_b_c_-_payoff_poster_1_.jpg', N'AfybuJ8zOAI'),
('PHIM051120248', N'TIÊN TRI TỬ THẦN', N'LEE Yoon-seok', N'JAEHYUN (NCT) - PARK JU-HYUN - KWAK SI-YANG', N'Hồi hộp', '01/11/2024', 90, N'Một kẻ lạ mặt Jun-woo (JaeHyun NCT) dự báo cái chết sẽ đến với Jeong-yun (PARK Ju-hyun) trong 6 tiếng sắp tới. Từ phớt lờ, đến hoang mang, và nhận ra hiểm họa gần kề, cô buộc phải đồng hành cùng kẻ tiên tri bí ẩn. Càng cố tìm hiểu cô lại nhận ra Jun-woo chính là manh mối duy nhất liên quan đến những vụ án sát nhân hàng loạt. Căng thẳng tột độ, liệu Jun-woo đã nhìn thấy tương lai hay chỉ đang giăng bẫy một nạn nhân xấu số?', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-tientri.jpg', N'new1kh3wnIA'),
('PHIM051120249', N'CÔ DÂU HÀO MÔN', N'Vũ Ngọc Đãng', N'Uyển Ân, Samuel An, Thu Trang, Lê Giang, Kiều Minh Tuấn, NSND Hồng Vân,...', N'Tâm Lý', '18/10/2024', 114, N'Phim lấy đề tài làm dâu hào môn và khai thác câu chuyện môn đăng hộ đối, lối sống và quy tắc của giới thượng lưu dưới góc nhìn hài hước và châm biếm.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/c/g/cgv_457x590.jpg', N'QJ8E9R70csY'),
('PHIM0511202410', N'TEE YOD: QUỶ ĂN TẠNG PHẦN 2', N'Taweewat Wantha', N'Nadech Kugimiya, Denise Jelilcha Kapaun, Mim Rattawadee Wongthong, Junior Kajbhunditt Jaidee, Friend Peerakrit Phacharaboonyakiat, Nutthatcha Jessica Padovan', N'Kinh Dị', '18/10/2024', 111, N'Ba năm sau cái chết của Yam, Yak vẫn tiếp tục săn lùng linh hồn bí ẩn mặc áo choàng đen. Gặp một cô gái có triệu chứng giống Yam, Yak phát hiện ra người bảo vệ linh hồn, pháp sư ẩn dật Puang, sống trong một khu rừng đầy nguy hiểm. Giữa những phép thuật ma quỷ và những sinh vật nguy hiểm. Khi họ đuổi theo linh hồn mặc áo choàng đen, tiếng kêu đầy ám ảnh của Tee Yod sắp quay trở lại một lần nữa...', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/r/s/rsz_ty2-main-poster-printing.jpg', N'vHONH3M9RYU'),
('PHIM0511202411', N'ROBOT HOANG DÃ', N'Chris Sanders', N'Lupita Nyongo, Pedro Pascal, Catherine O’hara, Bill Nighy,...', N'Gia đình, Hoạt Hình, Khoa Học Viễn Tưởng, Phiêu Lưu', '11/10/2024', 102, N'Cuộc phiêu lưu hoành tráng theo chân hành trình của một robot — đơn vị ROZZUM 7134, gọi tắt là Roz. Roz vô tình dạt vào hoang đảo sau một sự cố và nơi đây trở thành địa điểm sống mới của cô. Tại đây, Roz kết thân và nhận nuôi một chú ngỗng con, đặt tên là Brightbill. Roz và Brightbill dần dần thân thiết với các bạn thú trên đảo, song sau đó phải chống chọi, bảo vệ “nhà mới” trước sự xâm lăng của nhà máy từng sản xuất ra Roz.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/w/r/wrb_intl1sht_headtouch4_rgb_700x1000.jpg', N'2l8_FNIBWLM'),
('PHIM0511202412', N'BIỆT ĐỘI HOTGIRL', N'Vĩnh Khương', N'NSND Hoàng Dũng, Mr Kim, Yu CHU, Sam Sony, Bảo Uyên, Tuệ Minh, Thuỳ Trang, Ái Vân, Anna Linh', N'Hài, Hành Động, Tình cảm', '25/10/2024', 95, N'Câu chuyện của 6 cô gái đến từ 3 quốc gia Châu Á. Họ không biết mình là ai? Đến từ quốc gia gia nào? HẮC VÔ ĐẠO một tay trùm mafia buôn ma túy, buôn người giải thoát cứu sống 6 cô gái từ lúc nhỏ và nuôi dạy các cô gái trên hoang đảo. Các cô gái trưởng thành, khao khát được yêu nhưng cuộc sống và số phận buộc họ phải thực hiện những phi vụ mạo hiểm, kể cả giết người để bảo vệ những trẻ em vô tội.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/b/i/bi_t_i_hotgirl_-_payoff_poster_-_kc_25102024_1_.jpg', N'GCxopxk_BwY'),
('PHIM0511202413', N'ĐỐ ANH CÒNG ĐƯỢC TÔI', N'RYOO Seung-wan', N'HWANG Jung-min, JUNG Hae-in', N'Hài, Hành Động', '27/09/2024', 118, N'Các thanh tra kỳ cựu nổi tiếng đã hoạt động trở lại! Thám tử Seo Do-cheol (HWANG Jung-min) và đội điều tra tội phạm nguy hiểm của anh không ngừng truy lùng tội phạm cả ngày lẫn đêm, đặt cược cả cuộc sống cá nhân của họ. Nhận một vụ án sát hại một giáo sư, đội thanh tra nhận ra những mối liên hệ với các vụ án trong quá khứ và nảy sinh những nghi ngờ về một kẻ giết người hàng loạt. Điều này đã khiến cả nước rơi vào tình trạng hỗn loạn. Khi đội thanh tra đi sâu vào cuộc điều tra, kẻ sát nhân đã chế nhạo họ bằng cách công khai tung ra một đoạn giới thiệu trực tuyến, chỉ ra nạn nhân tiếp theo và làm gia tăng sự hỗn loạn. Để giải quyết mối đe dọa ngày càng leo thang, nhóm đã kết nạp một sĩ quan tân binh trẻ Park Sun-woo (JUNG Hae-in), dẫn đến những khúc mắc và đầy rẫy bất ngờ trong vụ án.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/r/s/rsz_exe_main-poster-v2.jpg', N'JgUWVooKSrA'),
('PHIM0511202414', N'MỘ ĐOM ĐÓM', N'Takahata Isao', N'Tatsumi Tsutomu, Shiraishi Ayano, Shinohara Yoshiko', N'Hoạt Hình', '04/10/2024', 89, N'Hai anh em Seita và Setsuko mất mẹ sau cuộc thả bom dữ dội của không quân Mỹ. Cả hai phải vật lộn để tồn tại ở Nhật Bản hậu Thế chiến II. Nhưng xã hội khắc nghiệt và chúng vật lộn tìm kiếm thức ăn cũng như thoát khỏi những khó khăn giữa chiến tranh.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/b/_/b_n_sao_c_a_m_om_m_-_payoff_poster_-_kthuoc_facebook.jpg', N'HgDzVFMi238'),
('PHIM0511202415', N'AN LẠC', N'Win Lwin Htet', N'Paing Takhon, LUCKY, Thu Htoo San, Khin Zar Chi Kyaw', N'Tâm Lý', '18/10/2024', 121, N'Bộ phim đạt 3 giải thưởng danh giá tại SEA International Film Festival 2024 sẽ mang đến cho khán giả một câu chuyện đáng yêu về một thầy tu và một chú chó cùng song hành với nhau vượt qua những vui buồn, ganh ghét của cuộc sống xung quanh, cùng nhau tìm đến hạnh phúc của cuộc đời.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-kankuang.jpg', N'e5d99hQeY6k'),
('PHIM0511202416', N'TRANSFORMERS MỘT', N'Josh Cooley', N'Chris Hemsworth; Brian Tyree Henry; Scarlett Johansson', N'Hành Động, Hoạt Hình, Phiêu Lưu', '27/09/2024', 104, N'Câu chuyện về nguồn gốc chưa từng được hé lộ của Optimus Prime và Megatron. Hai nhân vật được biết đến như những kẻ thù truyền kiếp, nhưng cũng từng là những người anh em gắn bó, đã thay đổi vận mệnh của Cybertron mãi mãi.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/t/f/tf1_intl_allspark_dgtl_online_payoff_keyart_vie_470x700.jpg', N'B8fKghIzKhc'),
('PHIM0511202417', N'CÁM', N'Trần Hữu Tấn', N'Quốc Cường, Thúy Diễm, Rima Thanh Vy, Lâm Thanh Mỹ, Hải Nam', N'Kinh Dị', '20/09/2024', 122, N'Câu chuyện phim là dị bản kinh dị đẫm máu lấy cảm hứng từ truyện cổ tích nổi tiếng Tấm Cám, nội dung chính của phim xoay quanh Cám - em gái cùng cha khác mẹ của Tấm đồng thời sẽ có nhiều nhân vật và chi tiết sáng tạo, gợi cảm giác vừa lạ vừa quen cho khán giả.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/0/300wx450h-cam_1_1.jpg', N'_8qUFEmPQbc'),
('PHIM0511202418', N'HỌC VIỆN ANH HÙNG: YOU ARE NEXT', N'Tensai Okamura', N'Van Barr Jr. - Nasim Benelkour - Gerard Caster', N'Hoạt Hình', '08/11/2024', 110, N'Vào mùa xuân năm thứ hai, trong khi Nhật Bản đang bị tàn phá bởi các cuộc chiến, một người đàn ông bí ẩn bất ngờ xuất hiện có tên là Dark Might. Đối mặt với Deku và những người bạn, hắn tự xưng mình là biểu tượng mới thay thế All Might với tuyên bố hùng hồn: "Tiếp theo là đến lượt ta!". Với dã tâm của mình, Dark Might sử dụng năng lực để tạo ra một pháo đài khổng lồ và nhốt người dân cùng anh hùng vào đó. Deku, Bakugo, Todoroki cùng lớp 1-A của trường U.A. dũng cảm đối đầu với Dark Might và tổ chức tội phạm bí ẩn do hắn cầm đầu, mang tên "Gia đình Gollini". Liệu họ có thể ngăn chặn tham vọng của biểu tượng mới Dark Might và bảo vệ thế giới?', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-academia.jpg', N'O_JcwpDergM'),
('PHIM0511202419', N'ĐÔI BẠN HỌC YÊU', N'E.Oni', N'Kim Go Eun, Steve Sanghyun Noh', N'Hài, Tình cảm', '08/11/2024', 118, N'Bộ phim xoay quanh đôi bạn ngỗ nghịch Jae-hee và Heung-soo cùng những khoảnh khắc “dở khóc dở cười” khi cùng chung sống trong một ngôi nhà. Jae-hee là một cô gái “cờ xanh” với tâm hồn tự do, sống hết mình với tình yêu. Ngược lại, Heung-soo lại là một “cờ đỏ” chính hiệu khi cho rằng tình yêu là sự lãng phí cảm xúc không cần thiết. Bỏ qua những tin đồn lan tràn do người khác tạo ra, Jae-hee và Heung-soo chọn sống chung nhưng yêu theo cách riêng của họ. Hai quan điểm tình yêu trái ngược sẽ đẩy cả hai sang những ngã rẽ và kết cục khác nhau. Sau cùng, Jae-hee hay Heung-soo sẽ về đích trong hành trình “học yêu” này?', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/l/i/litbc-main-poster-printing.jpg', N'EIARKqcXILM'),
('PHIM0511202420', N'MẬT MÃ ĐỎ', N'Jake Kasdan', N'Dwayne Johnson; Chris Evans; Lucy Liu', N'Hài, Hành Động, Phiêu Lưu', '08/11/2024', 125, N'Sau khi Ông già Noel (mật danh: Red One) bị bắt cóc, Trưởng An ninh Bắc Cực (Dwayne Johnson) phải hợp tác với thợ săn tiền thưởng khét tiếng nhất thế giới (Chris Evans) trong một nhiệm vụ kịch tính xuyên lục địa để giải cứu Giáng Sinh.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-red-one_1.jpg', N'2T_mKyH17mY'),
('PHIM0611202421', N'AI OÁN TRONG VƯỜN XUÂN', N'Koo Tae-jin', N'Jo Yoon-Hee, Kim Joo-Ryeong, Jung In-Gyeom, Heo Dong-Won, ...', N'Hồi hộp, Kinh Dị', '08/11/2024', 91, N'Phim xoay quanh So-hee, người đã mất đi gia đình hạnh phúc của mình vì cái chết đột ngột của chồng, và trải qua những điều kỳ lạ, rùng rợn sau khi đến thăm Neulbom Garden, một ngôi biệt thự nông thôn bí ẩn do chồng cô để lại.','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/o/poster_ai_oan_trong_vuon_xuan_4_1_.jpg', 'QeDo1uPujSc'),
('PHIM0611202422',N'KẺ ĐÓNG THẾ', N'Lương Quán Nghiêu - Lương Quán Thuấn', N'Lưu Tuấn Khiêm, Đổng Vĩ, Ngũ Doãn Long, Thái Tư Vận', N'Hành Động, Hồi hộp', '15/11/2024', 114, N'Một đạo diễn đóng thế hết thời đang vật lộn để tìm lối đi trong ngành công nghiệp điện ảnh nhiều biến động. Ông đánh cược tất cả để tạo nên màn tái xuất cuối cùng, đồng thời cố gắng hàn gắn mối quan hệ với cô con gái xa cách của mình.', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/k/e/kedongthe_teaser_poster_kt_facebook__kc15.11.2024.jpg', 'O62t0TMdG4I'),
('PHIM0611202423', N'ĐỪNG BUÔNG TAY', N'Alexandre Aja', N'Halle Berry, Anthony B. Jenkins, Stephanie Lavigne', N'Hồi hộp, Kinh Dị', '2024-11-08', 101, N'Một ngôi nhà chứa đầy bùa chú là nơi an toàn cuối cùng để tránh xa lũ quỷ trong thế giới hậu tận thế đáng sợ. Một người mẹ và 2 đứa con nhỏ phải kết nối với ngôi nhà bằng sợi dây thừng linh thiêng để sinh tồn nơi rừng rậm, nơi hai thực thể ác độc Kẻ Xấu và Kẻ Xa Lạ có thể tước đoạt mạng người trong một phút buông tay.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-never-let-go.jpg', N'ZlsGSkMIPaU'),
('PHIM0611202424', N'VÕ SĨ GIÁC ĐẤU II', N'Ridley Scott', N'Paul Mescal, Joseph Quinn, Pedro Pascal, Connie Nielsen, Denzel Washington', N'Hành Động, Phiêu Lưu, Tâm Lý', '15/11/2024', 148, N'Sau khi đánh mất quê hương vào tay hoàng đế bạo chúa – người đang cai trị Rome, Lucius trở thành nô lệ giác đấu trong đấu trường Colosseum và phải tìm kiếm sức mạnh từ quá khứ để đưa vinh quang trở lại cho người dân Rome.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/7/0/700x1000-gladiator.jpg', N'R4AFSgUGEEs'),
('PHIM0611202425', N'NGÀY TA ĐÃ YÊU', N'John Crowley', N'Andrew Garfield, Florence Pugh', N'Tâm Lý, Tình cảm', '15/11/2024', 108, N'Định mệnh đã đưa một nữ đầu bếp đầy triển vọng và một người đàn ông vừa trải qua hôn nhân đổ vỡ đến với nhau trong tình cảnh đặc biệt. Bộ phim là cuộc tình mười năm sâu đậm của cặp đôi này, từ lúc họ rơi vào lưới tình, xây dựng tổ ấm, cho đến khi một biến cố xảy đến thay đổi hoàn toàn cuộc đời họ.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/o/poster_ngay_ta_da_yeu_6.jpg', N'lbLk9PzHWfg'),
('PHIM0611202426', N'CU LI KHÔNG BAO GIỜ KHÓC', N'Phạm Ngọc Lân', N'NSND Minh Châu, Hoàng Hà, Hà Phương, Xuân An', N'Gia đình, Tâm Lý, Tình cảm', '15/11/2024', 92, N'Sau đám tang người chồng cũ ở nước ngoài, bà Nguyện quay lại Hà Nội với một bình tro và một con cu li nhỏ - loài linh trưởng đặc hữu của bán đảo Đông Dương. Về tới nơi, bà phát hiện ra cô cháu gái mang bầu đang vội vã chuẩn bị đám cưới. Lo sợ cô đi theo vết xe đổ của đời mình, bà kịch liệt phản đối. Bộ phim Cu Li Không Bao Giờ Khóc khéo léo pha trộn đời sống hiện tại và những dư âm phức tạp của lịch sử Việt Nam bằng cách đan xen hoài niệm về quá khứ của người dì lớn tuổi và dự cảm về tương lai đầy bất định của cặp đôi trẻ.', N'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/c/l/clnc-digitalposter-vnmarket-2048_1_.jpg', N'kMjlJkmt5nk'),
('PHIM0611202428',N'CÔNG CHÚA NỔI LOẠN: NHIỆM VỤ GIẢI CỨU HOÀNG GIA', N'Alex Tcit’Cilin', N'A family-friendly animated adventure comedy about a headstrong princess, a book smart commoner, and the power of love.', N'Hoạt Hình', '15/11/2024', 95, N'Câu chuyện ở xứ sở thần tiên nơi nàng công chúa mạnh mẽ Mina bị bắt cóc bởi tên phù thủy xấu xa. Nhưng thay vì chờ chàng hoàng tử sắp cưới của mình đến cứu, cô đã tự đứng lên tìm con đường thoát cho riêng mình.', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-rebelious.jpg', 'l_kkaIbzU28'),
('PHIM0611202429',N'WICKED', N'Jon M. Chu', N'Cynthia Erivo, Ariana Grande, Jonathan Bailey', N'Nhạc kịch, Thần thoại, Tình cảm', '22/11/2024', 161, N'Cho dù là tiểu thư xinh đẹp Galinda hay phù thủy da xanh Elphaba thì ai cũng có một giấc mơ của riêng mình. Xem ngay trailer của bom tấn điện ảnh màu nhiệm bậc nhất màn bạc mùa lễ hội WICKED! WICKED | Dự kiến khởi chiếu: 29.11.2024', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/w/k/wkd_forestduo_470x700.jpg', '0zMKy_2n7C0'),
('PHIM0611202430',N'CÔNG TỬ BẠC LIÊU', N'Lý Minh Thắng', N'NSUT Thành Lộc, Song Luân, Công Dương, Đoàn Thiên Ân,…', N'Hài, Tâm Lý, Tiểu Sử', '06/12/2024', 0, N'Lấy cảm hứng từ giai thoại nổi tiếng của nhân vật được mệnh danh là thiên hạ đệ nhất chơi ngông, Công Tử Bạc Liêu là bộ phim tâm lý hài hước, lấy bối cảnh Nam Kỳ Lục Tỉnh xưa của Việt Nam. BA HƠN - Con trai được thương yêu hết mực của ông Hội đồng Lịnh vốn là chủ ngân hàng đầu tiên tại Việt Nam, sau khi du học Pháp về đã sử dụng cả gia sản của mình vào những trò vui tiêu khiển, ăn chơi trác tán – nên được người dân gọi bằng cái tên Công Tử Bạc Liêu.', 'Lấy cảm hứng từ giai thoại nổi tiếng của nhân vật được mệnh danh là thiên hạ đệ nhất chơi ngông, Công Tử Bạc Liêu là bộ phim tâm lý hài hước, lấy bối cảnh Nam Kỳ Lục Tỉnh xưa của Việt Nam. BA HƠN - Con trai được thương yêu hết mực của ông Hội đồng Lịnh vốn là chủ ngân hàng đầu tiên tại Việt Nam, sau khi du học Pháp về đã sử dụng cả gia sản của mình vào những trò vui tiêu khiển, ăn chơi trác tán – nên được người dân gọi bằng cái tên Công Tử Bạc Liêu.', 'bmkR2EY_hcY');
go
select * from PHIM
go

--thêm dữ liệu cho bảng KHACHHANG
set dateformat DMY
INSERT INTO KHACHHANG VALUES
('KH011120241',N'Nguyễn Thúy An','an123@gmail.com','0898324512','123','01/11/2024'),
('KH011120242',N'Nguyễn Anh Tuấn','tuana123@gmail.com','0999123567','123','01/11/2024'),
('KH021120241',N'Phạm Văn Trường','trvp123@gmail.com','0756122144','123','02/11/2024'),
('KH031120241',N'Trần Thúy Ngân','ngan123@gmail.com','0456123777','123','03/11/2024'),
('KH031120242',N'Võ Trâm Anh','anhvo123@gmail.com','0123999823','123','03/11/2024'),
('KH051120241',N'Võ Huyền Trang','trang123@gmail.com','0231123876','123','05/11/2024'),
('KH051120242',N'Lý Hoàng Trang','trangly123@gmail.com','0455423321','123','05/11/2024')
GO
select * from KHACHHANG
GO

--thêm dữ liệu cho bảng RAP
INSERT INTO RAP VALUES
('RAP061120241',N'CinemaBox Hùng Vương Plaza',N'Tầng 7 | Hùng Vương Plaza, 126 Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh.',N'TP.Hồ Chí Minh'),
('RAP061120242',N'CinemaBox Vivo City',N'Lầu 5, TTTM SC VivoCity - 1058 Nguyễn Văn Linh, Quận 7',N'TP.Hồ Chí Minh'),
('RAP061120243',N'CinemaBox Menas Mall (CGV CT Plaza)',N'Tầng 10, TTTM Menas Mall, 60A Trường Sơn, P.2, Q. Tân Bình, TP.HCM, Việt Nam',N'TP.Hồ Chí Minh'),
('RAP061120244',N'CinemaBox Hoàng Văn Thụ',N'Tầng 1 và 2, Gala Center, số 415, Hoàng Văn Thụ, Phường 2, Quận Tân Bình, TPHCM',N'TP.Hồ Chí Minh'),
('RAP061120245',N'CinemaBox Vincom Center Landmark 81',N'Tầng B1 , TTTM Vincom Center Landmark 81, 772 Điện Biên Phủ, P.22, Q. Bình Thạnh, HCM',N'TP.Hồ Chí Minh'),
('RAP061120246',N'CinemaBox Crescent Mall',N'Lầu 5, Crescent Mall Đại lộ Nguyễn Văn Linh, Phú Mỹ Hưng Quận 7 TP. Hồ Chí Minh',N'TP.Hồ Chí Minh'),
('RAP061120247',N'CinemaBox Pearl Plaza',N'Tầng 5, Pearl Plaza, 561A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM',N'TP.Hồ Chí Minh'),
('RAP061120248',N'CinemaBox Pandora City',N'Lầu 3, Pandora City 1/1 Trường Chinh Quận Tân Phú TP. Hồ Chí Minh',N'TP.Hồ Chí Minh'),
('RAP061120249',N'CinemaBox Aeon Bình Tân',N'Tầng 3, TTTM Aeon Mall Bình Tân, Số 1 đường số 17A, khu phố 11, phường Bình Trị Đông B, quận Bình Tân, TPHCM',N'TP.Hồ Chí Minh'),
('RAP0611202410',N'CinemaBox Aeon Tân Phú',N'Lầu 3, Aeon Mall 30 Bờ Bao Tân Thắng, P. Sơn Kỳ Quận Tân Phú TP. Hồ Chí Minh',N'TP.Hồ Chí Minh'),

('RAP0611202411',N'CinemaBox Vincom Center Bà Triệu',N'Tầng 6, Toà nhà VinCom Center Hà Nội 191 đường Bà Triệu Quận Hai Bà Trưng Hà Nội',N'Hà Nội'),
('RAP0611202412',N'CinemaBox Indochina Plaza Hà Nội',N'Tầng 4, Indochina Plaza Hà Nội, 241 Xuân Thủy, Q. Cầu Giấy, Hà Nội',N'Hà Nội'),
('RAP0611202413',N'CinemaBox Vincom Times City',N'Tầng B1, TTTM Vincom Mega Mall Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội',N'Hà Nội'),
('RAP0611202414',N'CinemaBox Tràng Tiền Plaza',N'Tầng 5 , TTTM Tràng Tiền Plaza 24 Hai Bà Trưng, Q.Hoàn Kiếm, Hà Nội',N'Hà Nội'),
('RAP0611202415',N'CinemaBox Vincom Metropolis Liễu Giai',N'29 Liễu Giai, quận Ba Đình, Hà Nội',N'Hà Nội'),
('RAP0611202416',N'CinemaBox Aeon Hà Đông',N'Tầng 3 & 4 – TTTM AEON MALL HÀ ĐÔNG, P. Dương Nội, Q. Hà Đông, Hà Nội',N'Hà Nội'),
('RAP0611202417',N'CinemaBox Hồ Gươm Plaza',N'Tầng 3, TTTM Hồ Gươm Plaza, 110 Trần Phú, Phường Mỗ Lao, Quận Hà Đông, Hà Nội',N'Hà Nội'),
('RAP0611202418',N'CinemaBox CGV Rice City',N'Tầng 2 và 4, Tòa nhà Trung - RICE CITY Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, Thành phố Hà Nội',N'Hà Nội'),
('RAP0611202419',N'CinemaBox Vincom Long Biên',N'Tầng 5, TTTM Vincom Plaza Long Biên, khu đô thị Vinhomes Riverside, Phường Phúc Lợi, Quận Long Biên, Hà Nội',N'Hà Nội'),
('RAP0611202420',N'CinemaBox Xuân Diệu',N'Tầng 2, Tòa nhà D’. Le Roi Soleil, số 59 Xuân Diệu, P. Quảng An, Q. Tây Hồ, Hà Nội',N'Hà Nội'),

('RAP0611202421',N'CinemaBox Vĩnh Trung Plaza',N'255-257 đường Hùng Vương Quận Thanh Khê Tp. Đà Nẵng',N'Đà Nẵng'),
('RAP0611202422',N'CinemaBox Vincom Đà Nẵng',N'Tầng 4, TTTM Vincom Đà Nẵng, đường Ngô Quyền, P.An Hải Bắc, Q.Sơn Trà, TP. Đà Nẵng',N'Đà Nẵng'),
('RAP0611202423',N'CinemaBox Sense City',N'Lầu 3, Sense City 1 Đại Lộ Hòa Bình Quận Ninh Kiều TP. Cần Thơ',N'Cần Thơ'),
('RAP0611202424',N'CinemaBox Vincom Xuân Khánh',N'Tầng 5, Tòa nhà 209, Đường 30/04, Phường Xuân Khánh, Quận Ninh Kiều, Tp. Cần Thơ',N'Cần Thơ'),
('RAP0611202425',N'CinemaBox Coopmart Biên Hòa',N'Tầng 3, Khu Siêu thị Co-op Mart 121 Phạm Văn Thuận, P.Tân Tiến Tp. Biên Hoà Tỉnh Đồng Nai',N'Đồng Nai')
GO
SELECT * FROM RAP
GO

--thêm dữ liệu cho bảng PHONGCHIEU
INSERT INTO PHONGCHIEU VALUES
('PC061120241','RAP061120241','Phong HV Plaza 01',60),
('PC061120242','RAP061120241','Phong HV Plaza 02',60),

('PC061120243','RAP061120242','Phong Vivo City 01',60),
('PC061120244','RAP061120242','Phong Vivo City 02',60),

('PC061120245','RAP061120243','Phong CT Plaza 01',60),
('PC061120246','RAP061120243','Phong CT Plaza 02',60),

('PC061120247','RAP061120244','Phong HVT 01',60),
('PC061120248','RAP061120244','Phong HVT 02',60),

('PC061120249','RAP061120245','Phong Landmark 81 01',60),
('PC0611202410','RAP061120245','Phong Landmark 81 02',60),

('PC0611202411','RAP061120246','Phong Crescent Mall 01',60),
('PC0611202412','RAP061120246','Phong Crescent Mall 02',60),

('PC0611202413','RAP061120247','Phong Pearl Plaza 01',60),
('PC0611202414','RAP061120247','Phong Pearl Plaza 02',60),

('PC0611202415','RAP061120248','Phong Pandora City 01',60),
('PC0611202416','RAP061120248','Phong Pandora City 02',60),

('PC0611202417','RAP061120249','Phong Aeon BT 01',60),
('PC0611202418','RAP061120249','Phong Aeon BT 02',60),

('PC0611202419','RAP0611202410','Phong Aeon TP 01',60),
('PC0611202420','RAP0611202410','Phong Aeon TP 02',60),


('PC0611202421','RAP0611202411','Phong BT 01',60),
('PC0611202422','RAP0611202411','Phong BT 02',60),

('PC0611202423','RAP0611202412','Phong Indochina 01',60),
('PC0611202424','RAP0611202412','Phong Indochina 02',60),

('PC0611202425','RAP0611202413','Phong Vincom Times City 01',60),
('PC0611202426','RAP0611202413','Phong Vincom Times City 02',60),

('PC0611202427','RAP0611202414','Phong TT Plaza 01',60),
('PC0611202428','RAP0611202414','Phong TT Plaza 02',60),

('PC0611202429','RAP0611202415','Phong Metropolis LG 01',60),
('PC0611202430','RAP0611202415','Phong Metropolis LG 02',60),

('PC0611202431','RAP0611202416','Phong Aeon HD 01',60),
('PC0611202432','RAP0611202416','Phong Aeon HD 02',60),

('PC0611202433','RAP0611202417','Phong HG Plaza 01',60),
('PC0611202434','RAP0611202417','Phong HG Plaza 02',60),

('PC0611202435','RAP0611202418','Phong Rice City 01',60),
('PC0611202436','RAP0611202418','Phong Rice City 02',60),

('PC0611202437','RAP0611202419','Phong Vincom LB 01',60),
('PC0611202438','RAP0611202419','Phong Vincom LB 02',60),

('PC0611202439','RAP0611202420','Phong XD 01',60),
('PC0611202440','RAP0611202420','Phong XD 02',60),


('PC0611202441','RAP0611202421','Phong VT Plaza 01',60),
('PC0611202442','RAP0611202421','Phong VT Plaza 02',60),

('PC0611202443','RAP0611202422','Phong Vincom DN 01',60),
('PC0611202444','RAP0611202422','Phong Vincom DN 02',60),

('PC0611202445','RAP0611202423','Phong Sense City 01',60),
('PC0611202446','RAP0611202423','Phong Sense City 02',60),

('PC0611202447','RAP0611202424','Phong Vincom XK 01',60),
('PC0611202448','RAP0611202424','Phong Vincom XK 02',60),

('PC0611202449','RAP0611202425','Phong Coopmart BH 01',60),
('PC0611202450','RAP0611202425','Phong Coopmart BH 02',60)
GO
SELECT * FROM PHONGCHIEU
GO


--thêm dữ liệu cho bảng SUATCHIEU
--suất chiếu của từng phòng trong ngày 07/11/2024
set dateformat DMY
INSERT INTO SUATCHIEU VALUES
('SC071120241','PC061120241','07/11/2024'),
('SC071120242','PC061120242','07/11/2024'),
('SC071120243','PC061120243','07/11/2024'),
('SC071120244','PC061120244','07/11/2024'),
('SC071120245','PC061120245','07/11/2024'),
('SC071120246','PC061120246','07/11/2024'),
('SC071120247','PC061120247','07/11/2024'),
('SC071120248','PC061120248','07/11/2024'),
('SC071120249','PC061120249','07/11/2024'),
('SC0711202410','PC0611202410','07/11/2024'),
('SC0711202411','PC0611202411','07/11/2024'),
('SC0711202412','PC0611202412','07/11/2024'),
('SC0711202413','PC0611202413','07/11/2024'),
('SC0711202414','PC0611202414','07/11/2024'),
('SC0711202415','PC0611202415','07/11/2024'),
('SC0711202416','PC0611202416','07/11/2024'),
('SC0711202417','PC0611202417','07/11/2024'),
('SC0711202418','PC0611202418','07/11/2024'),
('SC0711202419','PC0611202419','07/11/2024'),
('SC0711202420','PC0611202420','07/11/2024'),

('SC0711202421','PC0611202421','07/11/2024'),
('SC0711202422','PC0611202422','07/11/2024'),
('SC0711202423','PC0611202423','07/11/2024'),
('SC0711202424','PC0611202424','07/11/2024'),
('SC0711202425','PC0611202425','07/11/2024'),
('SC0711202426','PC0611202426','07/11/2024'),
('SC0711202427','PC0611202427','07/11/2024'),
('SC0711202428','PC0611202428','07/11/2024'),
('SC0711202429','PC0611202429','07/11/2024'),
('SC0711202430','PC0611202430','07/11/2024'),
('SC0711202431','PC0611202431','07/11/2024'),
('SC0711202432','PC0611202432','07/11/2024'),
('SC0711202433','PC0611202433','07/11/2024'),
('SC0711202434','PC0611202434','07/11/2024'),
('SC0711202435','PC0611202435','07/11/2024'),
('SC0711202436','PC0611202436','07/11/2024'),
('SC0711202437','PC0611202437','07/11/2024'),
('SC0711202438','PC0611202438','07/11/2024'),
('SC0711202439','PC0611202439','07/11/2024'),
('SC0711202440','PC0611202440','07/11/2024'),

('SC0711202441','PC0611202441','07/11/2024'),
('SC0711202442','PC0611202442','07/11/2024'),
('SC0711202443','PC0611202443','07/11/2024'),
('SC0711202444','PC0611202444','07/11/2024'),
('SC0711202445','PC0611202445','07/11/2024'),
('SC0711202446','PC0611202446','07/11/2024'),
('SC0711202447','PC0611202447','07/11/2024'),
('SC0711202448','PC0611202448','07/11/2024'),
('SC0711202449','PC0611202449','07/11/2024'),
('SC0711202450','PC0611202450','07/11/2024')
GO
SELECT *FROM SUATCHIEU
GO

-- giả sử thêm suất chiếu cho tương lai: vd 8/11/2024
set dateformat DMY
INSERT INTO SUATCHIEU VALUES
('SC081120241','PC061120241','08/11/2024'),
('SC081120242','PC061120242','08/11/2024'),
('SC081120243','PC061120243','08/11/2024'),
('SC081120244','PC061120244','08/11/2024'),
('SC081120245','PC061120245','08/11/2024'),
('SC081120246','PC061120246','08/11/2024'),
('SC081120247','PC061120247','08/11/2024'),
('SC081120248','PC061120248','08/11/2024'),
('SC081120249','PC061120249','08/11/2024'),
('SC0811202410','PC0611202410','08/11/2024'),
('SC0811202411','PC0611202411','08/11/2024'),
('SC0811202412','PC0611202412','08/11/2024'),
('SC0811202413','PC0611202413','08/11/2024'),
('SC0811202414','PC0611202414','08/11/2024'),
('SC0811202415','PC0611202415','08/11/2024'),
('SC0811202416','PC0611202416','08/11/2024'),
('SC0811202417','PC0611202417','08/11/2024'),
('SC0811202418','PC0611202418','08/11/2024'),
('SC0811202419','PC0611202419','08/11/2024'),
('SC0811202420','PC0611202420','08/11/2024'),

('SC0811202421','PC0611202421','08/11/2024'),
('SC0811202422','PC0611202422','08/11/2024'),
('SC0811202423','PC0611202423','08/11/2024'),
('SC0811202424','PC0611202424','08/11/2024'),
('SC0811202425','PC0611202425','08/11/2024'),
('SC0811202426','PC0611202426','08/11/2024'),
('SC0811202427','PC0611202427','08/11/2024'),
('SC0811202428','PC0611202428','08/11/2024'),
('SC0811202429','PC0611202429','08/11/2024'),
('SC0811202430','PC0611202430','08/11/2024'),
('SC0811202431','PC0611202431','08/11/2024'),
('SC0811202432','PC0611202432','08/11/2024'),
('SC0811202433','PC0611202433','08/11/2024'),
('SC0811202434','PC0611202434','08/11/2024'),
('SC0811202435','PC0611202435','08/11/2024'),
('SC0811202436','PC0611202436','08/11/2024'),
('SC0811202437','PC0611202437','08/11/2024'),
('SC0811202438','PC0611202438','08/11/2024'),
('SC0811202439','PC0611202439','08/11/2024'),
('SC0811202440','PC0611202440','08/11/2024'),

('SC0811202441','PC0611202441','08/11/2024'),
('SC0811202442','PC0611202442','08/11/2024'),
('SC0811202443','PC0611202443','08/11/2024'),
('SC0811202444','PC0611202444','08/11/2024'),
('SC0811202445','PC0611202445','08/11/2024'),
('SC0811202446','PC0611202446','08/11/2024'),
('SC0811202447','PC0611202447','08/11/2024'),
('SC0811202448','PC0611202448','08/11/2024'),
('SC0811202449','PC0611202449','08/11/2024'),
('SC0811202450','PC0611202450','08/11/2024')
GO
SELECT *FROM SUATCHIEU
GO

--thêm dữ liệu cho bảng CHITIETSUAT
--một suất chiếu có ít nhất 3 khung giờ trong ngày 7/11/2024 và có kèm thêm trường hợp chiếu cùng một bộ phim mà khác khung giờ
INSERT INTO CHITIETSUAT VALUES
('PHIM051120241','SC071120241','8:30:00','10:20:00'),
('PHIM051120241','SC071120241','12:30:00','14:20:00'),
('PHIM0511202410','SC071120241','14:30:00','16:30:00'),
('PHIM0511202410','SC071120241','18:00:00','20:00:00'),
('PHIM0511202411','SC071120241','20:30:00','22:20:00'),

('PHIM0511202412','SC071120242','8:30:00','10:10:00'),
('PHIM0511202413','SC071120242','12:20:00','14:20:00'),
('PHIM0511202412','SC071120242','14:30:00','16:10:00'),
('PHIM0511202414','SC071120242','16:30:00','18:00:00'),
('PHIM0511202413','SC071120242','18:30:00','20:30:00'),
('PHIM0511202414','SC071120242','20:40:00','22:10:00'),

('PHIM0511202415','SC071120243','8:30:00','10:40:00'),
('PHIM0511202417','SC071120243','12:30:00','14:40:00'),
('PHIM0511202416','SC071120243','15:00:00','16:50:00'),
('PHIM0511202417','SC071120243','17:20:00','19:30:00'),
('PHIM0511202415','SC071120243','20:00:00','22:10:00'),

('PHIM0511202418','SC071120244','8:30:00','10:20:00'),
('PHIM0511202418','SC071120244','12:30:00','14:20:00'),
('PHIM0511202419','SC071120244','14:30:00','16:30:00'),
('PHIM051120242','SC071120244','17:30:00','19:50:00'),
('PHIM0511202419','SC071120244','20:00:00','22:00:00'),

('PHIM0511202420','SC071120245','8:30:00','10:40:00'),
('PHIM051120244','SC071120245','12:30:00','14:50:00'),
('PHIM051120243','SC071120245','15:00:00','17:20:00'),
('PHIM0511202420','SC071120245','18:10:00','20:20:00'),
('PHIM051120244','SC071120245','20:30:00','22:50:00'),

('PHIM051120245','SC071120246','8:30:00','10:20:00'),
('PHIM051120246','SC071120246','12:30:00','14:30:00'),
('PHIM051120247','SC071120246','15:00:00','16:40:00'),
('PHIM051120246','SC071120246','17:20:00','19:20:00'),
('PHIM051120247','SC071120246','20:20:00','22:00:00'),

('PHIM051120248','SC071120247','8:30:00','10:00:00'),
('PHIM0611202421','SC071120247','10:10:00','11:50:00'),
('PHIM051120248','SC071120247','12:30:00','14:00:00'),
('PHIM051120249','SC071120247','14:30:00','16:30:00'),
('PHIM051120248','SC071120247','17:20:00','18:50:00'),
('PHIM0611202421','SC071120247','19:20:00','20:50:00'),

('PHIM0611202422','SC071120248','8:30:00','10:30:00'),
('PHIM0611202423','SC071120248','12:30:00','14:20:00'),
('PHIM0611202424','SC071120248','15:00:00','17:30:00'),
('PHIM0611202423','SC071120248','18:20:00','20:10:00'),
('PHIM0611202422','SC071120248','20:20:00','22:20:00'),

('PHIM0611202425','SC071120249','8:30:00','10:20:00'),
('PHIM0611202426','SC071120249','12:30:00','14:10:00'),
('PHIM0611202428','SC071120249','15:00:00','16:40:00'),
('PHIM0611202425','SC071120249','18:00:00','19:50:00'),
('PHIM0611202428','SC071120249','20:20:00','22:00:00')
go

--bổ sung đến mã suất chiếu SC0711202427 có trong bảng SUATCHIEU
INSERT INTO CHITIETSUAT VALUES
('PHIM051120241','SC0711202410','8:30:00','10:20:00'),
('PHIM051120241','SC0711202410','12:30:00','14:20:00'),
('PHIM0511202410','SC0711202410','14:30:00','16:30:00'),
('PHIM0511202410','SC0711202410','18:00:00','20:00:00'),
('PHIM0511202411','SC0711202410','20:30:00','22:20:00'),

('PHIM0511202412','SC0711202411','8:30:00','10:10:00'),
('PHIM0511202413','SC0711202411','12:20:00','14:20:00'),
('PHIM0511202412','SC0711202411','14:30:00','16:10:00'),
('PHIM0511202414','SC0711202411','16:30:00','18:00:00'),
('PHIM0511202413','SC0711202411','18:30:00','20:30:00'),
('PHIM0511202414','SC0711202411','20:40:00','22:10:00'),

('PHIM0511202415','SC0711202412','8:30:00','10:40:00'),
('PHIM0511202417','SC0711202412','12:30:00','14:40:00'),
('PHIM0511202416','SC0711202412','15:00:00','16:50:00'),
('PHIM0511202417','SC0711202412','17:20:00','19:30:00'),
('PHIM0511202415','SC0711202412','20:00:00','22:10:00'),

('PHIM0511202418','SC0711202413','8:30:00','10:20:00'),
('PHIM0511202418','SC0711202413','12:30:00','14:20:00'),
('PHIM0511202419','SC0711202413','14:30:00','16:30:00'),
('PHIM051120242','SC0711202413','17:30:00','19:50:00'),
('PHIM0511202419','SC0711202413','20:00:00','22:00:00'),

('PHIM0511202420','SC0711202414','8:30:00','10:40:00'),
('PHIM051120244','SC0711202414','12:30:00','14:50:00'),
('PHIM051120243','SC0711202414','15:00:00','17:20:00'),
('PHIM0511202420','SC0711202414','18:10:00','20:20:00'),
('PHIM051120244','SC0711202414','20:30:00','22:50:00'),

('PHIM051120245','SC0711202415','8:30:00','10:20:00'),
('PHIM051120246','SC0711202415','12:30:00','14:30:00'),
('PHIM051120247','SC0711202415','15:00:00','16:40:00'),
('PHIM051120246','SC0711202415','17:20:00','19:20:00'),
('PHIM051120247','SC0711202415','20:20:00','22:00:00'),

('PHIM051120248','SC0711202416','8:30:00','10:00:00'),
('PHIM0611202421','SC0711202416','10:10:00','11:50:00'),
('PHIM051120248','SC0711202416','12:30:00','14:00:00'),
('PHIM051120249','SC0711202416','14:30:00','16:30:00'),
('PHIM051120248','SC0711202416','17:20:00','18:50:00'),
('PHIM0611202421','SC0711202416','19:20:00','20:50:00'),

('PHIM0611202422','SC0711202417','8:30:00','10:30:00'),
('PHIM0611202423','SC0711202417','12:30:00','14:20:00'),
('PHIM0611202424','SC0711202417','15:00:00','17:30:00'),
('PHIM0611202423','SC0711202417','18:20:00','20:10:00'),
('PHIM0611202422','SC0711202417','20:20:00','22:20:00'),

('PHIM0611202425','SC0711202418','8:30:00','10:20:00'),
('PHIM0611202426','SC0711202418','12:30:00','14:10:00'),
('PHIM0611202428','SC0711202418','15:00:00','16:40:00'),
('PHIM0611202425','SC0711202418','18:00:00','19:50:00'),
('PHIM0611202428','SC0711202418','20:20:00','22:00:00'),

('PHIM051120241','SC0711202419','8:30:00','10:20:00'),
('PHIM051120241','SC0711202419','12:30:00','14:20:00'),
('PHIM0511202410','SC0711202419','14:30:00','16:30:00'),
('PHIM0511202410','SC0711202419','18:00:00','20:00:00'),
('PHIM0511202411','SC0711202419','20:30:00','22:20:00'),

('PHIM0511202412','SC0711202420','8:30:00','10:10:00'),
('PHIM0511202413','SC0711202420','12:20:00','14:20:00'),
('PHIM0511202412','SC0711202420','14:30:00','16:10:00'),
('PHIM0511202414','SC0711202420','16:30:00','18:00:00'),
('PHIM0511202413','SC0711202420','18:30:00','20:30:00'),
('PHIM0511202414','SC0711202420','20:40:00','22:10:00'),

('PHIM0511202415','SC0711202421','8:30:00','10:40:00'),
('PHIM0511202417','SC0711202421','12:30:00','14:40:00'),
('PHIM0511202416','SC0711202421','15:00:00','16:50:00'),
('PHIM0511202417','SC0711202421','17:20:00','19:30:00'),
('PHIM0511202415','SC0711202421','20:00:00','22:10:00'),

('PHIM0511202418','SC0711202422','8:30:00','10:20:00'),
('PHIM0511202418','SC0711202422','12:30:00','14:20:00'),
('PHIM0511202419','SC0711202422','14:30:00','16:30:00'),
('PHIM051120242','SC0711202422','17:30:00','19:50:00'),
('PHIM0511202419','SC0711202422','20:00:00','22:00:00'),

('PHIM0511202420','SC0711202423','8:30:00','10:40:00'),
('PHIM051120244','SC0711202423','12:30:00','14:50:00'),
('PHIM051120243','SC0711202423','15:00:00','17:20:00'),
('PHIM0511202420','SC0711202423','18:10:00','20:20:00'),
('PHIM051120244','SC0711202423','20:30:00','22:50:00'),

('PHIM051120245','SC0711202424','8:30:00','10:20:00'),
('PHIM051120246','SC0711202424','12:30:00','14:30:00'),
('PHIM051120247','SC0711202424','15:00:00','16:40:00'),
('PHIM051120246','SC0711202424','17:20:00','19:20:00'),
('PHIM051120247','SC0711202424','20:20:00','22:00:00'),

('PHIM051120248','SC0711202425','8:30:00','10:00:00'),
('PHIM0611202421','SC0711202425','10:10:00','11:50:00'),
('PHIM051120248','SC0711202425','12:30:00','14:00:00'),
('PHIM051120249','SC0711202425','14:30:00','16:30:00'),
('PHIM051120248','SC0711202425','17:20:00','18:50:00'),
('PHIM0611202421','SC0711202425','19:20:00','20:50:00'),

('PHIM0611202422','SC0711202426','8:30:00','10:30:00'),
('PHIM0611202423','SC0711202426','12:30:00','14:20:00'),
('PHIM0611202424','SC0711202426','15:00:00','17:30:00'),
('PHIM0611202423','SC0711202426','18:20:00','20:10:00'),
('PHIM0611202422','SC0711202426','20:20:00','22:20:00'),

('PHIM0611202425','SC0711202427','8:30:00','10:20:00'),
('PHIM0611202426','SC0711202427','12:30:00','14:10:00'),
('PHIM0611202428','SC0711202427','15:00:00','16:40:00'),
('PHIM0611202425','SC0711202427','18:00:00','19:50:00'),
('PHIM0611202428','SC0711202427','20:20:00','22:00:00')
go
select * from CHITIETSUAT
go

--thêm dữ liệu cho bảng CHITIETSUAT của ngày 8/11/2024
--một suất chiếu có ít nhất 3 khung giờ trong ngày 8/11/2024 và có kèm thêm trường hợp chiếu cùng một bộ phim mà khác khung giờ
INSERT INTO CHITIETSUAT VALUES
('PHIM051120241','SC081120241','8:30:00','10:20:00'),
('PHIM051120241','SC081120241','12:30:00','14:20:00'),
('PHIM0511202410','SC081120241','14:30:00','16:30:00'),
('PHIM0511202410','SC081120241','18:00:00','20:00:00'),
('PHIM0511202411','SC081120241','20:30:00','22:20:00'),

('PHIM0511202412','SC081120242','8:30:00','10:10:00'),
('PHIM0511202413','SC081120242','12:20:00','14:20:00'),
('PHIM0511202412','SC081120242','14:30:00','16:10:00'),
('PHIM0511202414','SC081120242','16:30:00','18:00:00'),
('PHIM0511202413','SC081120242','18:30:00','20:30:00'),
('PHIM0511202414','SC081120242','20:40:00','22:10:00'),

('PHIM0511202415','SC081120243','8:30:00','10:40:00'),
('PHIM0511202417','SC081120243','12:30:00','14:40:00'),
('PHIM0511202416','SC081120243','15:00:00','16:50:00'),
('PHIM0511202417','SC081120243','17:20:00','19:30:00'),
('PHIM0511202415','SC081120243','20:00:00','22:10:00'),

('PHIM0511202418','SC081120244','8:30:00','10:20:00'),
('PHIM0511202418','SC081120244','12:30:00','14:20:00'),
('PHIM0511202419','SC081120244','14:30:00','16:30:00'),
('PHIM051120242','SC081120244','17:30:00','19:50:00'),
('PHIM0511202419','SC081120244','20:00:00','22:00:00'),

('PHIM0511202420','SC081120245','8:30:00','10:40:00'),
('PHIM051120244','SC081120245','12:30:00','14:50:00'),
('PHIM051120243','SC081120245','15:00:00','17:20:00'),
('PHIM0511202420','SC081120245','18:10:00','20:20:00'),
('PHIM051120244','SC081120245','20:30:00','22:50:00'),

('PHIM051120245','SC081120246','8:30:00','10:20:00'),
('PHIM051120246','SC081120246','12:30:00','14:30:00'),
('PHIM051120247','SC081120246','15:00:00','16:40:00'),
('PHIM051120246','SC081120246','17:20:00','19:20:00'),
('PHIM051120247','SC081120246','20:20:00','22:00:00'),

('PHIM051120248','SC081120247','8:30:00','10:00:00'),
('PHIM0611202421','SC081120247','10:10:00','11:50:00'),
('PHIM051120248','SC081120247','12:30:00','14:00:00'),
('PHIM051120249','SC081120247','14:30:00','16:30:00'),
('PHIM051120248','SC081120247','17:20:00','18:50:00'),
('PHIM0611202421','SC081120247','19:20:00','20:50:00'),

('PHIM0611202422','SC081120248','8:30:00','10:30:00'),
('PHIM0611202423','SC081120248','12:30:00','14:20:00'),
('PHIM0611202424','SC081120248','15:00:00','17:30:00'),
('PHIM0611202423','SC081120248','18:20:00','20:10:00'),
('PHIM0611202422','SC081120248','20:20:00','22:20:00'),

('PHIM0611202425','SC081120249','8:30:00','10:20:00'),
('PHIM0611202426','SC081120249','12:30:00','14:10:00'),
('PHIM0611202428','SC081120249','15:00:00','16:40:00'),
('PHIM0611202425','SC081120249','18:00:00','19:50:00'),
('PHIM0611202428','SC081120249','20:20:00','22:00:00')
go

--bổ sung đến mã suất chiếu SC0811202427 có trong bảng SUATCHIEU
INSERT INTO CHITIETSUAT VALUES
('PHIM051120241','SC0811202410','8:30:00','10:20:00'),
('PHIM051120241','SC0811202410','12:30:00','14:20:00'),
('PHIM0511202410','SC0811202410','14:30:00','16:30:00'),
('PHIM0511202410','SC0811202410','18:00:00','20:00:00'),
('PHIM0511202411','SC0811202410','20:30:00','22:20:00'),

('PHIM0511202412','SC0811202411','8:30:00','10:10:00'),
('PHIM0511202413','SC0811202411','12:20:00','14:20:00'),
('PHIM0511202412','SC0811202411','14:30:00','16:10:00'),
('PHIM0511202414','SC0811202411','16:30:00','18:00:00'),
('PHIM0511202413','SC0811202411','18:30:00','20:30:00'),
('PHIM0511202414','SC0811202411','20:40:00','22:10:00'),

('PHIM0511202415','SC0811202412','8:30:00','10:40:00'),
('PHIM0511202417','SC0811202412','12:30:00','14:40:00'),
('PHIM0511202416','SC0811202412','15:00:00','16:50:00'),
('PHIM0511202417','SC0811202412','17:20:00','19:30:00'),
('PHIM0511202415','SC0811202412','20:00:00','22:10:00'),

('PHIM0511202418','SC0811202413','8:30:00','10:20:00'),
('PHIM0511202418','SC0811202413','12:30:00','14:20:00'),
('PHIM0511202419','SC0811202413','14:30:00','16:30:00'),
('PHIM051120242','SC0811202413','17:30:00','19:50:00'),
('PHIM0511202419','SC0811202413','20:00:00','22:00:00'),

('PHIM0511202420','SC0811202414','8:30:00','10:40:00'),
('PHIM051120244','SC0811202414','12:30:00','14:50:00'),
('PHIM051120243','SC0811202414','15:00:00','17:20:00'),
('PHIM0511202420','SC0811202414','18:10:00','20:20:00'),
('PHIM051120244','SC0811202414','20:30:00','22:50:00'),

('PHIM051120245','SC0811202415','8:30:00','10:20:00'),
('PHIM051120246','SC0811202415','12:30:00','14:30:00'),
('PHIM051120247','SC0811202415','15:00:00','16:40:00'),
('PHIM051120246','SC0811202415','17:20:00','19:20:00'),
('PHIM051120247','SC0811202415','20:20:00','22:00:00'),

('PHIM051120248','SC0811202416','8:30:00','10:00:00'),
('PHIM0611202421','SC0811202416','10:10:00','11:50:00'),
('PHIM051120248','SC0811202416','12:30:00','14:00:00'),
('PHIM051120249','SC0811202416','14:30:00','16:30:00'),
('PHIM051120248','SC0811202416','17:20:00','18:50:00'),
('PHIM0611202421','SC0811202416','19:20:00','20:50:00'),

('PHIM0611202422','SC0811202417','8:30:00','10:30:00'),
('PHIM0611202423','SC0811202417','12:30:00','14:20:00'),
('PHIM0611202424','SC0811202417','15:00:00','17:30:00'),
('PHIM0611202423','SC0811202417','18:20:00','20:10:00'),
('PHIM0611202422','SC0811202417','20:20:00','22:20:00'),

('PHIM0611202425','SC0811202418','8:30:00','10:20:00'),
('PHIM0611202426','SC0811202418','12:30:00','14:10:00'),
('PHIM0611202428','SC0811202418','15:00:00','16:40:00'),
('PHIM0611202425','SC0811202418','18:00:00','19:50:00'),
('PHIM0611202428','SC0811202418','20:20:00','22:00:00'),


('PHIM051120241','SC0811202419','8:30:00','10:20:00'),
('PHIM051120241','SC0811202419','12:30:00','14:20:00'),
('PHIM0511202410','SC0811202419','14:30:00','16:30:00'),
('PHIM0511202410','SC0811202419','18:00:00','20:00:00'),
('PHIM0511202411','SC0811202419','20:30:00','22:20:00'),

('PHIM0511202412','SC0811202420','8:30:00','10:10:00'),
('PHIM0511202413','SC0811202420','12:20:00','14:20:00'),
('PHIM0511202412','SC0811202420','14:30:00','16:10:00'),
('PHIM0511202414','SC0811202420','16:30:00','18:00:00'),
('PHIM0511202413','SC0811202420','18:30:00','20:30:00'),
('PHIM0511202414','SC0811202420','20:40:00','22:10:00'),

('PHIM0511202415','SC0811202421','8:30:00','10:40:00'),
('PHIM0511202417','SC0811202421','12:30:00','14:40:00'),
('PHIM0511202416','SC0811202421','15:00:00','16:50:00'),
('PHIM0511202417','SC0811202421','17:20:00','19:30:00'),
('PHIM0511202415','SC0811202421','20:00:00','22:10:00'),

('PHIM0511202418','SC0811202422','8:30:00','10:20:00'),
('PHIM0511202418','SC0811202422','12:30:00','14:20:00'),
('PHIM0511202419','SC0811202422','14:30:00','16:30:00'),
('PHIM051120242','SC0811202422','17:30:00','19:50:00'),
('PHIM0511202419','SC0811202422','20:00:00','22:00:00'),

('PHIM0511202420','SC0811202423','8:30:00','10:40:00'),
('PHIM051120244','SC0811202423','12:30:00','14:50:00'),
('PHIM051120243','SC0811202423','15:00:00','17:20:00'),
('PHIM0511202420','SC0811202423','18:10:00','20:20:00'),
('PHIM051120244','SC0811202423','20:30:00','22:50:00'),

('PHIM051120245','SC0811202424','8:30:00','10:20:00'),
('PHIM051120246','SC0811202424','12:30:00','14:30:00'),
('PHIM051120247','SC0811202424','15:00:00','16:40:00'),
('PHIM051120246','SC0811202424','17:20:00','19:20:00'),
('PHIM051120247','SC0811202424','20:20:00','22:00:00'),

('PHIM051120248','SC0811202425','8:30:00','10:00:00'),
('PHIM0611202421','SC0811202425','10:10:00','11:50:00'),
('PHIM051120248','SC0811202425','12:30:00','14:00:00'),
('PHIM051120249','SC0811202425','14:30:00','16:30:00'),
('PHIM051120248','SC0811202425','17:20:00','18:50:00'),
('PHIM0611202421','SC0811202425','19:20:00','20:50:00'),

('PHIM0611202422','SC0811202426','8:30:00','10:30:00'),
('PHIM0611202423','SC0811202426','12:30:00','14:20:00'),
('PHIM0611202424','SC0811202426','15:00:00','17:30:00'),
('PHIM0611202423','SC0811202426','18:20:00','20:10:00'),
('PHIM0611202422','SC0811202426','20:20:00','22:20:00'),

('PHIM0611202425','SC0811202427','8:30:00','10:20:00'),
('PHIM0611202426','SC0811202427','12:30:00','14:10:00'),
('PHIM0611202428','SC0811202427','15:00:00','16:40:00'),
('PHIM0611202425','SC0811202427','18:00:00','19:50:00'),
('PHIM0611202428','SC0811202427','20:20:00','22:00:00')
go
select * from CHITIETSUAT
go

SELECT * FROM KHACHHANG

--thêm dữ liệu cho bảng VE
set dateformat DMY
INSERT INTO VE VALUES 
('VE021120241','SC071120241','KH011120241','02/11/2024 10:30:00',150000),

('VE021120242','SC071120242','KH011120242','02/11/2024 10:45:00',115000),
('VE031120241','SC071120243','KH021120241','03/11/2024 7:30:00',130000),
('VE041120241','SC071120241','KH031120241','04/11/2024 17:30:00',112000), 
('VE041120242','SC071120241','KH031120242','04/11/2024 20:30:00',70000),
('VE041120243','SC071120242','KH051120241','04/11/2024 20:45:00',70000)
GO

--thêm dữ liệu cho bảng VE khi khách hàng KH011120241 mua thêm vé vào ngày 4/11/2024 với suất chiếu SC071120241
INSERT INTO VE VALUES 
('VE041120244','SC071120241','KH011120241','04/11/2024 10:30:00',150000)
go

SELECT *FROM VE
GO

--thêm dữ liệu cho bảng LOAIGHE
INSERT INTO LOAIGHE VALUES 
('LG001',N'Ghế thường',60000),
('LG002',N'Ghế VIP',70000),
('LG003',N'Ghế Đôi',130000)
GO
SELECT * FROM LOAIGHE
GO

--thêm dữ liệu cho bảng GHE
--trong đó, phòng PC061120241 gồm 60 ghế

--cách thêm thủ công
--INSERT INTO GHE VALUES
--('GHE1',null,'LG001','PC061120241'),
--('GHE2',null,'LG002','PC061120241'),
--('GHE3',null,'LG001','PC061120241'),
--('GHE4',null,'LG003','PC061120241'),
----...
--('GHE60',null,'LG003','PC061120241')
--GO
SELECT *FROM GHE
GO

--cách thêm bằng vòng lặp
DECLARE @i INT = 1;
DECLARE @MaGhe VARCHAR(255);
DECLARE @MaLoaiGhe VARCHAR(255);
DECLARE @MaPhongChieu VARCHAR(255) = 'PC061120241';

WHILE @i <= 60
BEGIN
    -- Tạo mã ghế
    SET @MaGhe = 'GHE' + CAST(@i AS VARCHAR(10));
    
    --giả vị trí ghế nằm ở vị trí từ 1->30 là có loại ghế thường
	--giả vị trí ghế nằm ở vị trí từ 31->49 là có loại ghế vip
	--giả vị trí ghế nằm ở vị trí từ 50->60 là có loại ghế đôi
    IF @i BETWEEN 1 AND 30
        SET @MaLoaiGhe = 'LG001';
    ELSE IF @i BETWEEN 31 AND 49
        SET @MaLoaiGhe = 'LG002';
    ELSE IF @i BETWEEN 50 AND 60
        SET @MaLoaiGhe = 'LG003';

    -- Chèn dữ liệu vào bảng
    INSERT INTO Ghe (MAGHE, MAVE, MALOAIGHE, MAPHONG)
    VALUES (@MaGhe, NULL, @MaLoaiGhe, @MaPhongChieu);
    
    -- Tăng biến đếm
    SET @i = @i + 1;
END;
GO
SELECT *FROM GHE
GO

--thêm dữ liệu cho bảng CHITIETGHE
--do MAVE hiện tại trong bảng GHE chưa là null nên không thể thêm dữ liệu cho bảng CHITIETGHE

--thêm dữ liệu cho bảng DICHVU
INSERT INTO DICHVU VALUES
('DV001',N'Bắp rang bơ',30000,N'Hộp bắp rang bơ 1kg'),
('DV002',N'Bắp rang phô mai',35000,N'Hộp bắp rang phô mai 1kg'),
('DV003',N'Coca',25000,N'Lon Coca kèm với ly đá'),
('DV004',N'Sprite',25000,N'Lon Sprite kèm với ly đá'),
('DV005',N'Combo bắp nước A',50000,N'Combo 1 bắp rang bơ với 1 Coca'),
('DV006',N'Combo bắp nước B',52000,N'Combo 1 bắp rang phô mai với 1 Coca')
GO
SELECT * FROM DICHVU
GO

--thêm dữ liệu cho bảng CHITIETDICHVU
INSERT INTO CHITIETDICHVU VALUES
('VE021120241','DV005'),
('VE021120242','DV001'),
('VE021120242','DV004'),
('VE031120241','DV002'),
('VE031120241','DV004'),
('VE041120241','DV006')
GO
SELECT * FROM CHITIETDICHVU
GO