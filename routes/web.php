<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Auth::routes();
Route::get('/home', 'HomeController@index');
Route::prefix('admin')->group(function() {
   Route::get('/login','Auth\AdminLoginController@showLoginForm')->name('admin.login');
   Route::post('/login', 'Auth\AdminLoginController@login')->name('admin.login.submit');
   Route::get('logout/', 'Auth\AdminLoginController@logout')->name('admin.logout');
   Route::get('/', 'Auth\AdminController@index')->name('admin.home');
 }); 

Route::prefix('staff')->group(function() {
   Route::get('/login','Auth\StaffLoginController@showLoginForm')->name('staff.login');
   Route::post('/login', 'Auth\StaffLoginController@login')->name('staff.login.submit');
   Route::get('logout/', 'Auth\StaffLoginController@logout')->name('staff.logout');
   Route::get('/', 'Auth\StaffController@index')->name('staff.home');
 }); 
