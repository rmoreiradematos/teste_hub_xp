export class HttpService {
  private static readonly API_URL =
    process.env.API_URL || "http://localhost:3000/";

  private static async request<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    data?: BodyInit | Record<string, any>,
    params?: Record<string, string | number>,
    options?: RequestInit
  ): Promise<T> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          query.append(key, value.toString());
        });
      }

      const fullUrl = new URL(path, this.API_URL);
      fullUrl.search = query.toString();

      let body: BodyInit | undefined;
      let headers: HeadersInit = {
        ...options?.headers,
      };

      if (data instanceof FormData) {
        body = data;
      } else if (method !== "GET" && data) {
        body = JSON.stringify(data);
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      const response = await fetch(fullUrl.toString(), {
        method,
        headers,
        body,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  }

  static get<T>(
    path: string,
    params?: Record<string, string | number>,
    options?: RequestInit
  ) {
    return this.request<T>("GET", path, undefined, params, options);
  }

  static post<T>(
    path: string,
    data?: Record<string, any>,
    params?: Record<string, string | number>,
    options?: RequestInit
  ) {
    return this.request<T>("POST", path, data, params, options);
  }

  static postFile<T>(
    path: string,
    data: Record<string, any>,
    file: File,
    params?: Record<string, string | number>,
    options?: RequestInit
  ) {
    try {
      console.log("[HTTP] Iniciando postFile...");
      const formData = new FormData();

      console.log("[HTTP] Dados recebidos:", JSON.parse(JSON.stringify(data)));

      Object.entries(data).forEach(([key, value]) => {
        console.log(`[HTTP] Processando campo: ${key}`);

        if (Array.isArray(value)) {
          console.log(`[HTTP] Array detectado em ${key}:`, value);
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item.toString());
            console.log(`[HTTP] Adicionado ${key}[${index}]:`, item);
          });
        } else {
          console.log(`[HTTP] Valor simples em ${key}:`, value);
          formData.append(key, value.toString());
        }
      });

      console.log("[HTTP] Adicionando arquivo:", file.name);
      formData.append("image", file, file.name);

      console.log("[HTTP] Conteúdo do FormData:");
      for (const [key, value] of (formData as any).entries()) {
        console.log(key, value);
      }

      return this.request<T>("POST", path, formData, params, {
        ...options,
        headers: {
          ...options?.headers,
        },
      });
    } catch (error) {
      console.error("[HTTP] Erro crítico no postFile:", error);
      throw error;
    }
  }

  static patch<T>(
    path: string,
    data?: Record<string, any>,
    params?: Record<string, string | number>,
    options?: RequestInit
  ) {
    return this.request<T>("PATCH", path, data, params, options);
  }

  static patchFile<T>(
    path: string,
    file: File,
    params?: Record<string, string | number>,
    options?: RequestInit
  ) {
    const formData = new FormData();
    formData.append("image", file, file.name);

    return this.request<T>("PATCH", path, formData, params, options);
  }

  static delete<T>(
    path: string,
    params?: Record<string, string | number>,
    options?: RequestInit
  ) {
    return this.request<T>("DELETE", path, undefined, params, options);
  }
}

export default HttpService;
