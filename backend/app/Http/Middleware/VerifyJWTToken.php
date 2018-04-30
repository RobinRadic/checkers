<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\JWTAuth;

class VerifyJWTToken
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            if ( ! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json([ 'user_not_found' ], 404);
            }
        }
        catch (TokenExpiredException $e) {
            return response()->json([ 'token_expired' ], $e->getStatusCode());
        }
        catch (TokenInvalidException $e) {
            return response()->json([ 'token_invalid' ], $e->getStatusCode());
        }
        catch (JWTException $e) {
            return response()->json([ 'token_absent' ], $e->getStatusCode());
        }
//        catch (JWTException $e) {
//            return response()->json([ 'error' => 'invalid token' ], $e->getStatusCode());
//        }
        return $next($request);
    }
}
